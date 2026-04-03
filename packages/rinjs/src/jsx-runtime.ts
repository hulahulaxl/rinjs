export type Component<P = Record<string, unknown>> = (props: P) => VNode;

export type VNode = {
  type: keyof HTMLElementTagNameMap | Component<Record<string, unknown>>;
  props: Record<string, unknown>;
  children: Node[];
};

function normalizeChildren(children: unknown[]): Node[] {
  return children
    .flat()
    .map(c => (c instanceof Node ? c : document.createTextNode(String(c))));
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
  "children"
>;

type Props<K extends ElementType> = DOMProps<K> & {
  children?: JSX.Child | JSX.Child[];
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Child = Node | string | number | boolean | null | undefined;

  export interface ElementChildrenAttribute {
    children: {}; // eslint-disable-line @typescript-eslint/no-empty-object-type
  }

  export type Component<P = Record<string, unknown>> = (props: P) => Element;

  export interface Element {
    type: ElementType | Component<Record<string, unknown>>;
    props: Record<string, unknown>;
    children: Node[];
  }

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: Props<K>;
  };
}
