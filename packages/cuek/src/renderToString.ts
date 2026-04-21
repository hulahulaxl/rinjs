import type { ComponentContext, VNode } from "./types";

const escapeHTML = (str: string) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Elements that don't have closing tags (void elements)
const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

export function renderToString(vnode: VNode | string): string {
  if (typeof vnode === "string") {
    return escapeHTML(vnode);
  }

  if (typeof vnode.type === "function") {
    const mockCtx: ComponentContext = {
      rerender: () => {},
      onMount: () => {},
      onUnmount: () => {}
    };
    const renderFn = vnode.type(vnode.props, mockCtx);
    const childVNode = renderFn();
    return renderToString(childVNode);
  }

  const tagName = String(vnode.type);
  let html = `<${tagName}`;

  for (const key in vnode.props) {
    const attrName = key;
    const value = vnode.props[key];

    if (value == null) continue;

    if (value == null) continue;

    if (attrName.startsWith("on") && typeof value === "function") {
      continue; // Skip event listeners
    }

    if (attrName === "ref" && typeof value === "function") {
      continue; // Skip refs
    }

    if (attrName === "style" && typeof value === "object") {
      const styleStr = Object.entries(value)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
        .join(";");
      html += ` style="${escapeHTML(styleStr)}"`;
      continue;
    }

    if (typeof value === "boolean") {
      if (value) html += ` ${attrName}`;
      continue;
    }

    if (typeof value === "string" || typeof value === "number") {
      html += ` ${attrName}="${escapeHTML(String(value))}"`;
    }
  }

  if (VOID_ELEMENTS.has(tagName.toLowerCase())) {
    return html + ">";
  }

  html += ">";
  for (const child of vnode.children) {
    html += renderToString(child);
  }
  html += `</${tagName}>`;

  return html;
}
