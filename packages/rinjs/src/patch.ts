import type { VNode } from "./types";
import { renderNode } from "./mount";
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
        el.removeEventListener(
          key.slice(2).toLowerCase(),
          oldProps[key] as EventListener
        );
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
      if (typeof oldValue === "function") {
        el.removeEventListener(eventName, oldValue as EventListener);
      }
      el.addEventListener(eventName, newValue as EventListener);
      continue;
    }

    if (key === "ref" && typeof newValue === "function") {
      setTimeout(() => newValue(el), 0);
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
  newVNode: VNode
): Node {
  if (oldVNode.type !== newVNode.type) {
    const newNode = renderNode(newVNode);
    if (domNode.parentNode) {
      executeUnmount(domNode);
      domNode.parentNode.replaceChild(newNode, domNode);
    }
    return newNode;
  }

  // Components inherently hold their own closure states upon creation.
  // Passing new props statically down to a previously instantiated RinJS
  // closure is unsupported by design, so encountering a nested component
  // forces a full replacement, keeping the architecture purely localized.
  if (typeof newVNode.type === "function") {
    const newNode = renderNode(newVNode);
    if (domNode.parentNode) {
      domNode.parentNode.replaceChild(newNode, domNode);
    }
    return newNode;
  }

  const el = domNode as HTMLElement;

  updateProps(el, oldVNode.props, newVNode.props);

  const oldChildren = oldVNode.children;
  const newChildren = newVNode.children;

  const oldKeyed = new Map<string, { vnode: VNode; node: Node }>();
  const oldUnkeyed: ({ vnode: VNode | Node; node: Node } | null)[] = [];

  for (let i = 0; i < oldChildren.length; i++) {
    const oldChild = oldChildren[i];
    const childNode = el.childNodes[i];
    if (!childNode) continue;

    if (
      oldChild &&
      typeof oldChild === "object" &&
      "props" in oldChild &&
      oldChild.props &&
      oldChild.props.key != null
    ) {
      oldKeyed.set(String(oldChild.props.key), {
        vnode: oldChild as VNode,
        node: childNode
      });
    } else {
      oldUnkeyed.push({ vnode: oldChild, node: childNode });
    }
  }

  let unkeyedIndex = 0;

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    let matchedNode: Node | undefined;
    let matchedOldVNode: VNode | Node | undefined;

    if (
      newChild &&
      typeof newChild === "object" &&
      "props" in newChild &&
      newChild.props &&
      newChild.props.key != null
    ) {
      const key = String(newChild.props.key);
      const match = oldKeyed.get(key);
      if (match) {
        matchedNode = match.node;
        matchedOldVNode = match.vnode;
        oldKeyed.delete(key);
      }
    } else {
      if (unkeyedIndex < oldUnkeyed.length) {
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
      finalNode =
        newChild instanceof Node ? newChild : renderNode(newChild as VNode);
    } else {
      if (matchedOldVNode instanceof Node || newChild instanceof Node) {
        if (matchedOldVNode instanceof Text && newChild instanceof Text) {
          if (matchedOldVNode.nodeValue !== newChild.nodeValue) {
            if (matchedNode instanceof Text) {
              matchedNode.nodeValue = newChild.nodeValue;
            }
          }
          finalNode = matchedNode;
        } else {
          finalNode =
            newChild instanceof Node ? newChild : renderNode(newChild as VNode);
          executeUnmount(matchedNode);
        }
      } else {
        finalNode = patchDOM(
          matchedNode,
          matchedOldVNode as VNode,
          newChild as VNode
        );
      }
    }

    const referenceNode = el.childNodes[i] || null;
    if (referenceNode !== finalNode) {
      el.insertBefore(finalNode, referenceNode);
    }
  }

  oldKeyed.forEach(match => {
    executeUnmount(match.node);
    if (match.node.parentNode) match.node.parentNode.removeChild(match.node);
  });

  for (let i = 0; i < oldUnkeyed.length; i++) {
    const match = oldUnkeyed[i];
    if (match) {
      executeUnmount(match.node);
      if (match.node.parentNode) match.node.parentNode.removeChild(match.node);
    }
  }

  return el;
}
