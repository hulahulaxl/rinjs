import type { Component, ComponentContext, VNode } from "./types";
import { register } from "./rerender";

import { patchDOM } from "./patch";

export function eventProxy(this: Element, e: Event) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listeners = (this as any)._rinListeners;
  if (listeners && listeners[e.type]) {
    listeners[e.type](e);
  }
}

export function renderNode(vnode: VNode | string, isSvg = false): Node {
  if (typeof vnode === "string") return document.createTextNode(vnode);

  if (typeof vnode.type === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = vnode.type as Component<any>;
    let currentNode: Node;
    let renderClosure: (() => VNode) | undefined = undefined;
    const mountCallbacks: Array<() => void> = [];
    const unmountCallbacks: Array<() => void> = [];

    const ctx: ComponentContext = {
      rerender: () => {
        if (!renderClosure) return currentNode;
        const newVNode = renderClosure();

        // Retrieve the stored VNode footprint off the physical DOM node
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oldVNode = (currentNode as any)._vnode as VNode;

        // Seamlessly patch the physical DOM node recursively
        currentNode = patchDOM(currentNode, oldVNode, newVNode);

        // Update the footprint to match the newly evaluated layout
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentNode as any)._vnode = newVNode;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentNode as any)._componentProps = vnode.props;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentNode as any)._componentRerender = ctx.rerender;
        return currentNode;
      },
      onMount: cb => {
        mountCallbacks.push(cb);
      },
      onUnmount: cb => {
        unmountCallbacks.push(cb);
      }
    };

    const result = component(vnode.props, ctx);
    renderClosure = result;
    const initialVNode = renderClosure();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const deregister = register(vnode.type as Function, vnode.props.group as string | undefined, ctx.rerender);
    unmountCallbacks.push(deregister);

    currentNode = renderNode(initialVNode, isSvg);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentNode as any)._vnode = initialVNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentNode as any)._unmount = unmountCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentNode as any)._componentProps = vnode.props;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentNode as any)._componentRerender = ctx.rerender;

    // Call mount callbacks safely after the stack clears
    setTimeout(() => {
      mountCallbacks.forEach(cb => cb());
    }, 0);

    return currentNode;
  }

  const isNodeSvg = isSvg || vnode.type === "svg";
  const el = isNodeSvg
    ? document.createElementNS("http://www.w3.org/2000/svg", vnode.type as string)
    : document.createElement(vnode.type as string);

  for (const key in vnode.props) {
    const value = vnode.props[key];

    if (value == null) continue;

    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyEl = el as any;
      if (!anyEl._rinListeners) anyEl._rinListeners = {};
      if (!anyEl._rinListeners[eventName]) el.addEventListener(eventName, eventProxy);
      anyEl._rinListeners[eventName] = value;
      continue;
    }

    if (key === "ref" && typeof value === "function") {
      setTimeout(() => value(el), 0);
      continue;
    }

    if (key === "style" && typeof value === "object") {
      Object.assign(el.style, value);
      continue;
    }

    if (typeof value === "boolean") {
      if (key in el) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el as any)[key] = value;
      }
      if (value) {
        el.setAttribute(key, "");
      } else {
        el.removeAttribute(key);
      }
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      el.setAttribute(key, String(value));
    }
  }

  vnode.children.forEach(child => {
    el.appendChild(renderNode(child, isNodeSvg));
  });

  return el;
}

export function mount(vnode: VNode, container: HTMLElement = document.body) {
  container.appendChild(renderNode(vnode));
}
