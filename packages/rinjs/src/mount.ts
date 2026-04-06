import type { Component, ComponentContext, VNode } from "./types";

import { patchDOM } from "./patch";

export function renderNode(vnode: VNode): Node {
  if (typeof vnode.type === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = vnode.type as Component<any>;
    let currentNode: Node;
    let renderClosure: (() => VNode) | undefined = undefined;
    const mountCallbacks: Array<() => void> = [];

    const ctx: ComponentContext = {
      rerender: () => {
        if (!renderClosure) return;
        const newVNode = renderClosure();

        // Retrieve the stored VNode footprint off the physical DOM node
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oldVNode = (currentNode as any)._vnode as VNode;

        // Seamlessly patch the physical DOM node recursively
        currentNode = patchDOM(currentNode, oldVNode, newVNode);

        // Update the footprint to match the newly evaluated layout
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentNode as any)._vnode = newVNode;
      },
      onMount: cb => {
        mountCallbacks.push(cb);
      },
      onUnmount: _cb => {
        // v1: ignore teardown
      }
    };

    const result = component(vnode.props, ctx);
    renderClosure = result;
    const initialVNode = renderClosure();

    currentNode = renderNode(initialVNode);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentNode as any)._vnode = initialVNode;

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
