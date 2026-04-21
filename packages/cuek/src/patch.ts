import type { VNode } from "./types";
import { renderNode, eventProxy } from "./mount";
import { executeUnmount } from "./unmount";

function updateProps(
  el: HTMLElement,
  oldProps: Record<string, unknown>,
  newProps: Record<string, unknown>
) {
  // Remove old props
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key.startsWith("on") && typeof oldProps[key] === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyEl = el as any;
        if (anyEl._cuekListeners) {
          anyEl._cuekListeners[key.slice(2).toLowerCase()] = undefined;
        }
      } else if (key === "innerHTML") {
        el.innerHTML = "";
      } else if (key === "style") {
        el.style.cssText = "";
      } else {
        el.removeAttribute(key);
      }
    }
  }

  // Set new props
  for (const key in newProps) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue === newValue) continue;

    if (key.startsWith("on") && typeof newValue === "function") {
      const eventName = key.slice(2).toLowerCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyEl = el as any;
      if (!anyEl._cuekListeners) anyEl._cuekListeners = {};
      if (!anyEl._cuekListeners[eventName]) el.addEventListener(eventName, eventProxy);
      anyEl._cuekListeners[eventName] = newValue;
      continue;
    }

    if (key === "ref" && typeof newValue === "function") {
      setTimeout(() => newValue(el), 0);
      continue;
    }

    if (key === "innerHTML" && typeof newValue === "string") {
      if (oldValue !== newValue) el.innerHTML = newValue;
      continue;
    }

    if (key === "style" && typeof newValue === "object") {
      Object.assign(el.style, newValue as Record<string, string>);
      continue;
    }

    if (typeof newValue === "boolean") {
      if (oldValue !== newValue) {
        if (key in el) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (el as any)[key] = newValue;
        }
        if (newValue) {
          el.setAttribute(key, "");
        } else {
          el.removeAttribute(key);
        }
      }
      continue;
    }

    if (
      typeof newValue === "string" ||
      typeof newValue === "number"
    ) {
      if (oldValue !== newValue) {
        el.setAttribute(key, String(newValue));
      }
    }
  }
}

export function patchDOM(
  domNode: Node,
  oldVNode: VNode,
  newVNode: VNode,
  isSvg = false
): Node {
  const isNodeSvg = isSvg || (domNode instanceof Element && domNode.namespaceURI === "http://www.w3.org/2000/svg");

  if (oldVNode.type !== newVNode.type) {
    const newNode = renderNode(newVNode, isNodeSvg);
    if (domNode.parentNode) {
      executeUnmount(domNode);
      domNode.parentNode.replaceChild(newNode, domNode);
    }
    return newNode;
  }

  // Components inherently hold their own closure states upon creation.
  // Instead of destroying the component, we mutate its props reference
  // so the inner closure correctly renders the new data natively!
  if (typeof newVNode.type === "function") {
    if (oldVNode.type === newVNode.type) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingProps = (domNode as any)._componentProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rerenderFn = (domNode as any)._componentRerender;

      if (existingProps && rerenderFn) {
        // Erase old prop values dynamically without V8 dictionary de-opts!
        // We set to undefined instead of using 'delete' natively.
        for (const key in existingProps) {
          if (!(key in newVNode.props)) {
            existingProps[key] = undefined;
          }
        }
        // Inject new prop values natively
        for (const key in newVNode.props) existingProps[key] = newVNode.props[key];
        
        return rerenderFn();
      }
    }

    const newNode = renderNode(newVNode, isNodeSvg);
    if (domNode.parentNode) {
      executeUnmount(domNode);
      domNode.parentNode.replaceChild(newNode, domNode);
    }
    return newNode;
  }

  const el = domNode as HTMLElement;

  updateProps(el, oldVNode.props, newVNode.props);

  const oldChildren = oldVNode.children;
  const newChildren = newVNode.children;

  // Snapshot DOM children ONCE before either loop runs.
  // el.childNodes is a live NodeList — any insertion, removal or replaceChild
  // during patching will shift indices. Using a frozen array in both loops
  // keeps the VNode↔DOM pairing consistent throughout.
  const domSnapshot = Array.from(el.childNodes);

  let oldKeyed: Map<string, { vnode: VNode; node: Node }> | undefined;
  let oldUnkeyed: ({ vnode: VNode | string; node: Node } | null)[] | undefined;

  for (let i = 0; i < oldChildren.length; i++) {
    const oldChild = oldChildren[i];
    const childNode = domSnapshot[i];  // ← use snapshot, not live NodeList
    if (!childNode) continue;

    if (
      oldChild &&
      typeof oldChild === "object" &&
      "props" in oldChild &&
      oldChild.props &&
      oldChild.props.key != null
    ) {
      if (!oldKeyed) oldKeyed = new Map();
      oldKeyed.set(String(oldChild.props.key), {
        vnode: oldChild as VNode,
        node: childNode
      });
    } else {
      if (!oldUnkeyed) oldUnkeyed = [];
      oldUnkeyed.push({ vnode: oldChild, node: childNode });
    }
  }

  let unkeyedIndex = 0;

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    let matchedNode: Node | undefined;
    let matchedOldVNode: VNode | string | undefined;

    if (
      newChild &&
      typeof newChild === "object" &&
      "props" in newChild &&
      newChild.props &&
      newChild.props.key != null
    ) {
      const key = String(newChild.props.key);
      const match = oldKeyed?.get(key);
      if (match && oldKeyed) {
        matchedNode = match.node;
        matchedOldVNode = match.vnode;
        oldKeyed.delete(key);
      }
    } else {
      if (oldUnkeyed && unkeyedIndex < oldUnkeyed.length) {
        const match = oldUnkeyed[unkeyedIndex];
        if (match) {
          matchedNode = match.node;
          matchedOldVNode = match.vnode;
          oldUnkeyed[unkeyedIndex] = null;
        }
        unkeyedIndex++;
      }
    }

    let finalNode: Node;

    if (!matchedNode || !matchedOldVNode) {
      finalNode = renderNode(newChild, isNodeSvg);
    } else {
      if (typeof matchedOldVNode === "string" || typeof newChild === "string") {
        if (typeof matchedOldVNode === "string" && typeof newChild === "string") {
          if (matchedOldVNode !== newChild) {
            if (matchedNode instanceof Text) {
              matchedNode.nodeValue = newChild;
            } else {
              matchedNode = document.createTextNode(newChild);
            }
          }
          finalNode = matchedNode;
        } else {
          // Old was a string/text node, new is an element (or vice versa).
          // executeUnmount only fires lifecycle callbacks — it does NOT remove
          // the node from the DOM. We must explicitly remove it here or it
          // becomes an invisible ghost that corrupts future VNode/DOM pairing.
          finalNode = renderNode(newChild, isNodeSvg);
          executeUnmount(matchedNode);
          if (matchedNode.parentNode) {
            matchedNode.parentNode.removeChild(matchedNode);
          }
        }
      } else {
        finalNode = patchDOM(
          matchedNode,
          matchedOldVNode as VNode,
          newChild as VNode,
          isNodeSvg
        );
      }
    }

    const referenceNode = el.childNodes[i] ?? null;

    if (referenceNode !== finalNode) {
      el.insertBefore(finalNode, referenceNode);
    }
  }

  if (oldKeyed) {
    oldKeyed.forEach(match => {
      executeUnmount(match.node);
      if (match.node.parentNode) match.node.parentNode.removeChild(match.node);
    });
  }

  if (oldUnkeyed) {
    for (let i = 0; i < oldUnkeyed.length; i++) {
      const match = oldUnkeyed[i];
      if (match) {
        executeUnmount(match.node);
        if (match.node.parentNode) match.node.parentNode.removeChild(match.node);
      }
    }
  }

  return el;
}
