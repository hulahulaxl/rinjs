import type { ComponentContext, VNode } from "./types";

function normalizeChildren(children: unknown[]): (VNode | Node)[] {
  return children.flat().map(c => {
    if (c instanceof Node) return c;
    if (typeof c === "object" && c !== null && "type" in c) return c as VNode;
    return document.createTextNode(String(c));
  });
}

export function jsx(
  type: VNode["type"],
  props: Record<string, unknown> | null
): VNode {
  const { children, ...rest } = props ?? {};

  return {
    type,
    props: rest,
    children: normalizeChildren(
      children === undefined
        ? []
        : Array.isArray(children)
          ? children
          : [children]
    )
  };
}

export { jsx as jsxs };
export { jsx as jsxDEV };

type ElementType = keyof HTMLElementTagNameMap;

type DOMProps<K extends ElementType> = Omit<
  Partial<HTMLElementTagNameMap[K]>,
  "children" | "style"
> & {
  style?: Partial<CSSStyleDeclaration> | string;
};

type Props<K extends ElementType> = DOMProps<K> & {
  children?: JSX.Child | JSX.Child[];
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Child =
    | Node
    | Element
    | string
    | number
    | boolean
    | null
    | undefined;

  export interface ElementChildrenAttribute {
    children: {}; // eslint-disable-line @typescript-eslint/no-empty-object-type
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ElementType = string | Component<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Component<P = any> = (
    props: P,
    ctx: ComponentContext
  ) => () => Element;

  export interface Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: ElementType | Component<any>;
    props: Record<string, unknown>;
    children: (VNode | Node)[];
  }

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: Props<K>;
  };
}
