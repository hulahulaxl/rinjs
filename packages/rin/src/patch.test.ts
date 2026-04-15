import { describe, it, expect, vi } from "vitest";
import { patchDOM } from "./patch";
import { renderNode } from "./mount";
import { jsx } from "./jsx-runtime";
import type { VNode } from "./types";

describe("patchDOM", () => {
  it("updates attributes properly", () => {
    const oldVNode = jsx("div", { id: "old", "data-val": "1" }) as VNode;
    const newVNode = jsx("div", { id: "new", class: "added" }) as VNode;

    const node = renderNode(oldVNode) as HTMLElement;
    
    // Perform patch
    patchDOM(node, oldVNode, newVNode);
    
    expect(node.id).toBe("new");
    expect(node.className).toBe("added");
    expect(node.hasAttribute("data-val")).toBe(false);
  });

  it("adds and removes unkeyed children", () => {
    const oldVNode = jsx("ul", {
      children: [
        jsx("li", { children: "1" }),
        jsx("li", { children: "2" }),
      ]
    }) as VNode;

    const node = renderNode(oldVNode) as HTMLElement;
    expect(node.childNodes.length).toBe(2);

    const newVNode = jsx("ul", {
      children: [
        jsx("li", { children: "1" }),
      ]
    }) as VNode;

    patchDOM(node, oldVNode, newVNode);
    expect(node.childNodes.length).toBe(1);
    expect(node.textContent).toBe("1");

    const futureVNode = jsx("ul", {
      children: [
        jsx("li", { children: "1" }),
        jsx("li", { children: "2" }),
        jsx("li", { children: "3" }),
      ]
    }) as VNode;

    patchDOM(node, newVNode, futureVNode);
    expect(node.childNodes.length).toBe(3);
    expect(node.textContent).toBe("123");
  });

  it("handles keyed children reordering", () => {
    const oldVNode = jsx("ul", {
      children: [
        jsx("li", { key: "a", children: "A" }),
        jsx("li", { key: "b", children: "B" }),
        jsx("li", { key: "c", children: "C" }),
      ]
    }) as VNode;

    const node = renderNode(oldVNode) as HTMLElement;
    const nodeA = node.childNodes[0];
    const nodeB = node.childNodes[1];
    const nodeC = node.childNodes[2];

    const newVNode = jsx("ul", {
      children: [
        jsx("li", { key: "c", children: "C" }),
        jsx("li", { key: "b", children: "B" }),
        jsx("li", { key: "a", children: "A" }),
      ]
    }) as VNode;

    patchDOM(node, oldVNode, newVNode);
    expect(node.childNodes.length).toBe(3);
    expect(node.textContent).toBe("CBA");

    // Existing nodes should have been reused and reordered
    expect(node.childNodes[0]).toBe(nodeC);
    expect(node.childNodes[1]).toBe(nodeB);
    expect(node.childNodes[2]).toBe(nodeA);
  });

  it("replaces nodes of different types entirely", () => {
    const oldVNode = jsx("div", { children: "hello" }) as VNode;
    const newVNode = jsx("p", { children: "hello" }) as VNode;

    // We must mock parent for replaceChild to work
    const parent = document.createElement("div");
    const node = renderNode(oldVNode);
    parent.appendChild(node);

    const result = patchDOM(node, oldVNode, newVNode);
    expect(result.nodeName).toBe("P");
    expect(parent.childNodes[0]).toBe(result);
  });

  it("handles innerHTML changes", () => {
    const oldVNode = jsx("div", { innerHTML: "<p>one</p>" }) as VNode;
    const newVNode = jsx("div", { innerHTML: "<p>two</p>" }) as VNode;

    const node = renderNode(oldVNode) as HTMLElement;
    expect(node.innerHTML).toBe("<p>one</p>");

    patchDOM(node, oldVNode, newVNode);
    expect(node.innerHTML).toBe("<p>two</p>");
  });
});
