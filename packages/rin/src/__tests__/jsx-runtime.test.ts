import { describe, it, expect } from "vitest";
import { jsx, Fragment } from "../jsx-runtime";
import type { VNode } from "../types";

describe("jsx-runtime", () => {
  it("creates a simple VNode", () => {
    const vnode = jsx("div", { id: "test" }) as VNode;
    expect(vnode.type).toBe("div");
    expect(vnode.props).toEqual({ id: "test" });
    expect(vnode.children).toEqual([]);
  });

  it("handles children array unrolling", () => {
    const vnode = jsx("ul", {
      children: [
        jsx("li", { children: "A" }),
        [jsx("li", { children: "B" }), jsx("li", { children: "C" })]
      ]
    }) as VNode;

    expect(vnode.children.length).toBe(3);
    expect((vnode.children[0] as VNode).type).toBe("li");
    expect((vnode.children[1] as VNode).type).toBe("li");
    expect((vnode.children[2] as VNode).type).toBe("li");
  });

  it("handles Fragment by extracting children", () => {
    const vnode = jsx("div", {
      children: [
        jsx("span", { children: "Start" }),
        jsx(Fragment, {
          children: [
            jsx("span", { children: "Middle 1" }),
            jsx("span", { children: "Middle 2" })
          ]
        }),
        jsx("span", { children: "End" })
      ]
    }) as VNode;

    expect(vnode.children.length).toBe(4);

    // Check that Fragment was flattened
    const childrenTypes = vnode.children.map(c => (c as VNode).type);
    expect(childrenTypes).toEqual(["span", "span", "span", "span"]);
  });

  it("skips empty and nullish children", () => {
    const vnode = jsx("div", {
      children: [
        "valid",
        "",
        null,
        undefined,
        false,
        true, // Booleans are considered strictly logical and stripped
        "also valid",
        0 // Numbers are kept and stringified
      ]
    }) as VNode;

    expect(vnode.children).toEqual(["valid", "also valid", "0"]);
  });
});
