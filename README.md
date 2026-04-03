# RinJS Documentation

## Overview

**RinJS** is a minimal, TypeScript-first UI library for building reactive browser interfaces with a small runtime and predictable architecture.

It focuses on:

- simplicity
- explicit rendering flow
- strong typing
- minimal abstraction
- no virtual DOM

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

Components are plain functions:

```ts
function App() {
  return <div>Hello</div>
}
```

No classes. No decorators. No lifecycle APIs.

---

## Direct DOM Rendering

RinJS does not use a virtual DOM.

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
mount(App, document.body);
```

---

# Comparison With React

| Feature           | RinJS      | React      |
| ----------------- | ---------- | ---------- |
| Virtual DOM       | No         | Yes        |
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

# Rendering

Mount application:

```ts
import { mount } from "rinjs";

mount(App, document.getElementById("app"));
```

---

# Example Counter

```tsx
function Counter() {
  let count = 0;

  const increment = () => {
    count++;
    rerender();
  };

  return (
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
 ├── renderer.ts
 ├── mount.ts
 ├── component.ts
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
