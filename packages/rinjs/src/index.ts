import type { VNode, Component } from "./jsx-runtime";

function createElement(vnode: VNode): Node {
  if (typeof vnode.type === "function") {
    const component = vnode.type as Component<Record<string, unknown>>;
    return createElement(component(vnode.props));
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

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      el.setAttribute(key, String(value));
    }
  }

  vnode.children.forEach(child => {
    el.appendChild(child);
  });

  return el;
}

export function render(vnode: VNode, container: HTMLElement = document.body) {
  container.appendChild(createElement(vnode));
}
