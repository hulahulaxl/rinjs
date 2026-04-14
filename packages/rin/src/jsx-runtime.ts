import type { ComponentContext, VNode } from "./types";

function normalizeChildren(children: unknown[]): (VNode | string)[] {
  const result: (VNode | string)[] = [];
  function flatten(arr: unknown[]) {
    for (let i = 0; i < arr.length; i++) {
      const c = arr[i];
      if (Array.isArray(c)) {
        flatten(c);
      } else if (c != null && typeof c !== "boolean") {
        if (typeof c === "object" && "type" in c) {
          result.push(c as VNode);
        } else {
          result.push(String(c));
        }
      }
    }
  }
  flatten(children);
  return result;
}

export const Fragment = Symbol("Fragment");

export function jsx(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: VNode["type"] | symbol | any,
  props: Record<string, unknown> | null,
  key?: string | number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const { children, ...rest } = props ?? {};

  const normalizedChildren = normalizeChildren(
    children === undefined
      ? []
      : Array.isArray(children)
        ? children
        : [children]
  );

  if (type === Fragment) {
    return normalizedChildren;
  }

  if (key != null) {
    rest.key = key;
  }

  return {
    type,
    props: rest,
    children: normalizedChildren
  };
}

export { jsx as jsxs };
export { jsx as jsxDEV };

type ElementType = keyof HTMLElementTagNameMap;

type DOMProps<K extends ElementType> = Omit<
  Partial<HTMLElementTagNameMap[K]>,
  "children" | "style" | "className"
> & {
  class?: string;
  style?: Partial<CSSStyleDeclaration> | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: (el: any) => void;
  key?: string | number;

  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

interface AriaAttributes {
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean | "true" | "false";
  "aria-checked"?: boolean | "mixed" | "true" | "false";
  "aria-current"?:
    | boolean
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";
  "aria-disabled"?: boolean | "true" | "false";
  "aria-controls"?: string;
  "aria-live"?: "off" | "assertive" | "polite";
  "aria-modal"?: boolean | "true" | "false";
  "aria-selected"?: boolean | "true" | "false";
  "aria-invalid"?: boolean | "grammar" | "spelling" | "true" | "false";
}

type Props<K extends ElementType> = DOMProps<K> &
  AriaAttributes & {
    children?: JSX.Child | JSX.Child[];
  };

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Child =
    | Element
    | string
    | number
    | boolean
    | null
    | undefined
    | Child[];

  export interface ElementChildrenAttribute {
    children: {}; // eslint-disable-line @typescript-eslint/no-empty-object-type
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ElementType = string | Component<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Component<P = any> = (
    props: P & { group?: string },
    ctx: ComponentContext
  ) => () => Element;

  export interface Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: ElementType | Component<any>;
    props: Record<string, unknown>;
    children: (VNode | string)[];
  }

  export type RelaxedSVGProps<K extends keyof SVGElementTagNameMap> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [P in keyof SVGElementTagNameMap[K]]?: any; // Native keys with relaxed types for intellisense
  } & {
    class?: string;
    style?: string | Partial<CSSStyleDeclaration>;
    children?: JSX.Child | JSX.Child[];

    // Common SVG dashed attributes missing from native DOM interfaces
    "fill-rule"?: "nonzero" | "evenodd" | "inherit";
    "clip-rule"?: "nonzero" | "evenodd" | "inherit";
    "stroke-width"?: number | string;
    "stroke-linecap"?: "butt" | "round" | "square" | "inherit";
    "stroke-linejoin"?: "miter" | "round" | "bevel" | "inherit";
    "stroke-dasharray"?: string | number;
    "stroke-dashoffset"?: string | number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  } & AriaAttributes;

  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: Props<K>;
  } & {
    [K in keyof SVGElementTagNameMap]: RelaxedSVGProps<K>;
  };
}
