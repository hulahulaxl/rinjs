# RinJS Documentation

## Overview

**RinJS** is a minimal, TypeScript-first UI library for building reactive browser interfaces with a small runtime and predictable architecture.

It focuses on:

- simplicity
- explicit rendering flow
- strong typing
- minimal abstraction
- minimal virtual DOM

RinJS targets developers who want component-based UI without framework overhead.

---

# Motivation

Modern UI frameworks often introduce:

- virtual DOM overhead
- hidden lifecycle complexity
- schedulers
- large dependency graphs
- indirection between state and DOM

RinJS instead provides:

- direct DOM rendering
- explicit execution model
- predictable updates
- very small runtime surface
- full control over rendering behavior

Suitable use cases:

- internal dashboards
- Tauri apps
- tooling interfaces
- experimental UI systems
- lightweight SPAs

---

# Core Principles

## Functions Are Components

Components are plain functions that return a render function:

```ts
function App() {
  return () => <div>Hello</div>
}
```

No classes. No decorators. No lifecycle APIs.

---

## Transparent Virtual DOM

RinJS builds minimal Virtual DOM templates strictly to power local, fast DOM patching.

> **Note:** RinJS may migrate entirely to an Ahead-Of-Time (AOT) compiler architecture in the future. This would completely eliminate the Virtual DOM and DOM-patching engines, allowing for true direct-to-DOM updates like Svelte or SolidJS, while preserving our explicit component execution model.

Rendering pipeline:

```
Component → DOM Nodes
```

This avoids diffing cost and improves predictability.

---

## Explicit Reactivity

State changes trigger controlled rerenders explicitly.

No hidden scheduler.

No implicit batching.

---

## TypeScript First

RinJS is designed around strict typing:

- JSX typing
- children typing
- DOM typing
- component typing

---

# Architecture

Rendering pipeline:

```
JSX
 ↓
jsx-runtime
 ↓
element objects
 ↓
renderer
 ↓
real DOM
```

---

## JSX Runtime

Transforms:

```tsx
<div>Hello</div>
```

into:

```ts
jsx("div", { children: "Hello" });
```

---

## Element Structure

Example internal node:

```ts
{
  type: "div",
  props: {},
  children: ["Hello"]
}
```

---

## Renderer

Renderer converts nodes into DOM:

```
string → TextNode
number → TextNode
element → HTMLElement
component → execute function
array → flatten recursively
```

---

## Mount Engine

Attach component tree to container:

```ts
mount(<App />, document.body);
```

---

# Comparison With React

| Feature           | RinJS      | React      |
| ----------------- | ---------- | ---------- |
| Virtual DOM       | Minimal    | Yes        |
| Scheduler         | No         | Yes        |
| Hooks             | Optional   | Core       |
| Lifecycle         | No         | Yes        |
| Bundle Size       | Very small | Large      |
| Rendering         | Direct DOM | Diff-based |
| Abstraction Level | Low        | Medium     |
| Control           | High       | Medium     |

RinJS prioritizes control over automation.

---

# Component Model

Example:

```tsx
function Button() {
  return <button>Click</button>;
}
```

Usage:

```tsx
function App() {
  return (
    <div>
      <Button />
    </div>
  );
}
```

---

# Props

Props are standard function parameters:

```tsx
type Props = {
  title: string;
};

function Header(props: Props) {
  return <h1>{props.title}</h1>;
}
```

Usage:

```tsx
<Header title="Dashboard" />
```

---

# Children

Children pass through JSX normally:

```tsx
function Card(props) {
  return <div>{props.children}</div>;
}
```

Usage:

```tsx
<Card>Content here</Card>
```

---

# Rendering & Reactivity

RinJS provides three primary APIs for rendering and updating the DOM explicitly.

### Initial Mounting

Mount your root application to the DOM:

```ts
import { mount } from "rinjs";

mount(<App />, document.getElementById("app"));
```

### Targeted Rerendering

RinJS does not use an automated Virtual DOM scheduler. Instead, reactivity is explicit and localized. You precisely dictate when updates generate patching routines by using `rerender`:

1. **Rerender by Component Reference**: Globally updates all active instances of a specific component function on the page.

```ts
import { rerender } from "rinjs";

function Header() {
  return <header>Local Time: {new Date().toLocaleTimeString()}</header>;
}

// Somewhere else, trigger an update for all <Header /> components:
rerender(Header);
```

2. **Rerender by Key string**: Updates specific elements or components tagged with an explicit `$key` property. Useful for highly specific or targeted updates.

```ts
import { rerender } from "rinjs";

// Component or element rendered with <section $key="user-stats" />
rerender("user-stats");
```

3. **Rerender by Component Context**: Renders solely the specific component instance issuing the call. To ensure zero-magic predictability, RinJS passes a reliable execution context as the second argument to any component.

```tsx
function Dropdown(props, ctx) {
  let isOpen = false;

  const toggle = () => {
    isOpen = !isOpen;
    ctx.rerender(); // Triggers update ONLY for this exact dropdown instance
  };

  // Return a closure that handles future re-renders
  return () => (
    <div>
      <button onclick={toggle}>Toggle</button>
      {isOpen && <div>Content</div>}
    </div>
  );
}
```

### Demounting & Cleanup

To prevent memory leaks when components are removed dynamically, RinJS provides an explicit `unmount` API to clean up active trees and unbind listeners.

```ts
import { unmount } from "rinjs";

// Tear down a whole container
unmount(document.getElementById("app"));

// Tear down all instances of a specific Component
unmount(Header);

// Tear down elements tagged with a specific key
unmount("user-stats");
```

---

# Lifecycles

While RinJS eliminates complex implicit lifecycle scheduling, you will still need to perform side-effects predictably (like data fetching or WebGL rendering) when working with direct DOM mutations.

Because component functions are executed only once to initialize state, your `ctx.onMount` logic is inherently immune to infinite-loop fetch bugs. RinJS saves and executes the inner closure returned by your component on every `ctx.rerender`:

```tsx
function APIDataLoader(props, ctx) {
  let data = null;

  // Triggers precisely once after the element first hits the DOM.
  ctx.onMount(() => {
    fetch("/api/data").then(async res => {
      data = await res.json();
      ctx.rerender(); // Trigger local UI update
    });
  });

  // Triggers precisely once when unmount() destroys this node.
  ctx.onUnmount(() => {
    console.log("Cleaning up active subscriptions...");
  });

  // The rendering logic closure dynamically evaluated on every update
  return () => <div>{data ? data : "Loading..."}</div>;
}
```

---

# Example Counter

```tsx
function Counter(props, ctx) {
  // Initialization - runs exactly once
  let count = 0;

  const increment = () => {
    count++;
    ctx.rerender(); // rerender self only
  };

  // Rendering - execution closure bound to rerender
  return () => (
    <div>
      <p>{count}</p>
      <button onclick={increment}>Increment</button>
    </div>
  );
}
```

---

# JSX Runtime Setup

Example `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "rinjs"
  }
}
```

---

# Example Project Structure

```
rinjs/
 ├── jsx-runtime.ts
 ├── types.ts
 ├── mount.ts
 └── index.ts
```

---

# When To Use RinJS

Recommended for:

- internal tools
- dashboards
- Tauri apps
- lightweight SPA
- experimental rendering engines

Not ideal for:

- plugin ecosystems
- React-dependent environments
- large teams requiring framework conventions

---

# Design Philosophy

RinJS prioritizes:

```
clarity > abstraction
control > automation
size > ecosystem
```

It is a foundation UI library rather than a full framework.
