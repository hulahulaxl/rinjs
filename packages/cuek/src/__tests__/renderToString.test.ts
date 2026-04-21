import { describe, it, expect } from "vitest";
import { renderToString } from "../renderToString";
import { jsx } from "../jsx-runtime";
import type { ComponentContext } from "../types";

function MyComponent(
  { name, count }: { name: string; count: number },
  ctx: ComponentContext
) {
  return () =>
    jsx("div", {
      class: "container",
      style: { color: "red", marginTop: "10px" },
      children: [
        jsx("h1", { children: `Hello ${name}` }),
        jsx("p", { children: `Count: ${count}` }),
        jsx("input", { type: "text", disabled: true }),
        jsx("button", { onclick: () => {}, children: "Click me" })
      ]
    });
}

function App() {
  return () =>
    jsx("main", {
      id: "app",
      children: [jsx(MyComponent, { name: "Cuek", count: 42 })]
    });
}

describe("renderToString (SSR)", () => {
  it("renders virtual DOM nodes to HTML strings correctly", () => {
    const vnode = jsx(App, {});
    const html = renderToString(vnode);

    const expected = `<main id="app"><div class="container" style="color:red;margin-top:10px"><h1>Hello Cuek</h1><p>Count: 42</p><input type="text" disabled><button>Click me</button></div></main>`;

    expect(html).toBe(expected);
  });
});
