import { describe, it, expect, vi } from "vitest";
import { renderNode, mount } from "./mount";
import { jsx } from "./jsx-runtime";
import type { ComponentContext } from "./types";

describe("mount.ts", () => {
  it("renders simple element with attributes", () => {
    const vnode = jsx("div", { id: "test", class: "btn" });
    const node = renderNode(vnode) as HTMLElement;

    expect(node.tagName).toBe("DIV");
    expect(node.id).toBe("test");
    expect(node.getAttribute("class")).toBe("btn");
  });

  it("handles boolean attributes", () => {
    const vnode = jsx("input", { type: "checkbox", checked: true, disabled: false });
    const node = renderNode(vnode) as HTMLInputElement;

    expect(node.type).toBe("checkbox");
    expect(node.checked).toBe(true);
    expect(node.hasAttribute("checked")).toBe(true);
    expect(node.disabled).toBe(false);
    expect(node.hasAttribute("disabled")).toBe(false);
  });

  it("sets innerHTML", () => {
    const vnode = jsx("div", { innerHTML: "<span>Hello</span>" });
    const node = renderNode(vnode) as HTMLElement;

    expect(node.innerHTML).toBe("<span>Hello</span>");
  });

  it("adds event listeners", () => {
    const spy = vi.fn();
    const vnode = jsx("button", { onclick: spy });
    const node = renderNode(vnode) as HTMLElement;

    node.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("handles component creation and contexts", () => {
    let internalCtx: ComponentContext;
    function TestComp(props: { name: string }, ctx: ComponentContext) {
      internalCtx = ctx;
      return () => jsx("span", { children: props.name });
    }

    const vnode = jsx(TestComp, { name: "Rin" });
    const node = renderNode(vnode) as HTMLElement;

    expect(node.tagName).toBe("SPAN");
    expect(node.textContent).toBe("Rin");
    
    // Check that context is populated
    expect(internalCtx!).toBeDefined();
    expect(typeof internalCtx!.rerender).toBe("function");
    expect(typeof internalCtx!.onMount).toBe("function");
    expect(typeof internalCtx!.onUnmount).toBe("function");
  });
  
  it("executes ref callbacks", async () => {
    const spy = vi.fn();
    const vnode = jsx("div", { ref: spy });
    
    const node = renderNode(vnode) as HTMLElement;
    
    // ref callbacks are run via setTimeout({}, 0) in mount.ts
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    expect(spy).toHaveBeenCalledWith(node);
  });
});
