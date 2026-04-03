/* =========================
   Types
========================= */

export type Primitive = string | number | boolean | null | undefined;

export type Child = VNode | Primitive;

export type Children = Child[];

export type Props = Record<string, unknown>;

/* =========================
   VNode
========================= */

export type ElementVNode = {
  type: string;
  props: Props;
  children: Children;
};

export type VNode = ElementVNode;

export type FragmentVNode = {
  type: "fragment";
  props: {}; // eslint-disable-line @typescript-eslint/no-empty-object-type
  children: Children;
};

/* =========================
   JSX factory
========================= */

export function h<P extends Props>(
  type: string,
  props: P | null,
  ...children: Children
): VNode {
  return {
    type,
    props: props ?? {},
    children
  };
}

export function Fragment(props: { children?: Children }): FragmentVNode {
  return {
    type: "fragment",
    props: {},
    children: props.children ?? []
  };
}

/* =========================
   Prop handling
========================= */

function setProps(el: Element, props: Record<string, unknown>): void {
  for (const key in props) {
    if (key === "$key") continue;

    const value = props[key];

    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();

      el.addEventListener(event, value as EventListener);

      continue;
    }

    if (key === "style" && value) {
      Object.assign((el as HTMLElement).style, value);
      continue;
    }

    if (value == null) continue;

    el.setAttribute(key, String(value));
  }
}

/* =========================
   DOM creation
========================= */

function createDom(child: Child): Node {
  if (child === null || child === undefined || child === false) {
    return document.createTextNode("");
  }

  if (
    typeof child === "string" ||
    typeof child === "number" ||
    child === true
  ) {
    return document.createTextNode(String(child));
  }

  const el = document.createElement(child.type);

  setProps(el, child.props);

  for (const c of child.children) {
    el.appendChild(createDom(c));
  }

  return el;
}

/* =========================
   Root render
========================= */

export function render(vnode: VNode, container: HTMLElement): void {
  container.innerHTML = "";
  container.appendChild(createDom(vnode));
}
