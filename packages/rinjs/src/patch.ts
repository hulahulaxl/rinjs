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

    if (key === "style" && typeof newValue === "object") {
      Object.assign(el.style, newValue as Record<string, string>);
      continue;
    }

    if (
      typeof newValue === "string" ||
      typeof newValue === "number" ||
      typeof newValue === "boolean"
    ) {
      el.setAttribute(key, String(newValue));
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

  const maxLen = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLen; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    const childNode = el.childNodes[i];

    if (!oldChild && newChild) {
      // Added new child
      const childOutput =
        newChild instanceof Node ? newChild : renderNode(newChild as VNode);
      el.appendChild(childOutput);
    } else if (oldChild && !newChild) {
      // Removed child
      if (childNode) {
        executeUnmount(childNode);
        el.removeChild(childNode);
      }
    } else if (oldChild && newChild) {
      if (oldChild instanceof Node || newChild instanceof Node) {
        if (oldChild instanceof Text && newChild instanceof Text) {
          if (oldChild.nodeValue !== newChild.nodeValue) {
            if (childNode instanceof Text) {
              childNode.nodeValue = newChild.nodeValue;
            }
          }
        } else {
          const newNode =
            newChild instanceof Node ? newChild : renderNode(newChild as VNode);
          if (childNode) {
            executeUnmount(childNode);
            el.replaceChild(newNode, childNode);
          } else {
            el.appendChild(newNode);
          }
        }
      } else {
        // Recursive patch
        if (childNode) {
          patchDOM(childNode, oldChild as VNode, newChild as VNode);
        }
      }
    }
  }

  return el;
}
