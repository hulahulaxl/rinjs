import type { Component, ComponentContext, VNode } from "./types";

export function renderNode(vnode: VNode): Node {
  if (typeof vnode.type === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = vnode.type as Component<any>;
    let currentNode: Node;
    let renderClosure: (() => VNode) | undefined;
    const mountCallbacks: Array<() => void> = [];

    const ctx: ComponentContext = {
      rerender: () => {
        if (!renderClosure) return;
        const newVNode = renderClosure();
        const newNode = renderNode(newVNode);
        if (currentNode && currentNode.parentNode) {
          currentNode.parentNode.replaceChild(newNode, currentNode);
        }
        currentNode = newNode;
      },
      onMount: (cb) => {
        mountCallbacks.push(cb);
      },
      onUnmount: (_cb) => {
        // v1: ignore teardown
      }
    };

    const result = component(vnode.props, ctx);
    let initialVNode: VNode;

    if (typeof result === "function") {
      renderClosure = result as () => VNode;
      initialVNode = renderClosure();
    } else {
      initialVNode = result as VNode;
    }

    currentNode = renderNode(initialVNode);

    // Call mount callbacks safely after the stack clears
    setTimeout(() => {
      mountCallbacks.forEach(cb => cb());
    }, 0);

    return currentNode;
  }

  const el = document.createElement(vnode.type);

  for (const key in vnode.props) {
    const value = vnode.props[key];

    if (value == null) continue;

    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value as EventListener);
      continue;
    }

    if (key === "style" && typeof value === "object") {
      Object.assign(el.style, value);
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      el.setAttribute(key, String(value));
    }
  }

  vnode.children.forEach(child => {
    if (child instanceof Node) {
      el.appendChild(child);
    } else {
      el.appendChild(renderNode(child));
    }
  });

  return el;
}

export function mount(vnode: VNode, container: HTMLElement = document.body) {
  container.appendChild(renderNode(vnode));
}
