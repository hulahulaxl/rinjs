// /* =========================
//    Types
// ========================= */

// export type Primitive =
//   | string
//   | number
//   | boolean
//   | null
//   | undefined;

// export type Child = VNode | Primitive;

// export type Children = Child[];

// export type Props = Record<string, unknown>;

// export type Component<P extends Props = Props> = (
//   props: P,
//   ctx: ComponentContext
// ) => VNode;

// /* =========================
//    Context
// ========================= */

// export interface ComponentContext {
//   render(): void;
//   onUnmount(fn: () => void): void;
// }

// /* =========================
//    VNode
// ========================= */

// export type ElementVNode = {
//   type: string;
//   props: Props;
//   children: Children;
// };

// export type ComponentVNode<P extends Props = Props> = {
//   type: Component<P>;
//   props: P;
//   children: [];
// };

// export type FragmentVNode = {
//   type: "fragment";
//   props: {};
//   children: Children;
// };

// export type VNode =
//   | ElementVNode
//   | ComponentVNode
//   | FragmentVNode;

// /* =========================
//    Instance
// ========================= */

// interface Instance<P extends Props = Props> {
//   vnode: VNode;
//   dom: Node;
//   component: Component<P>;
//   props: P;
//   render(): void;
//   cleanups: (() => void)[];
// }

// /* =========================
//    Registries
// ========================= */

// const componentRegistry =
//   new Map<Component, Set<Instance>>();

// const keyRegistry =
//   new Map<string, Set<Instance>>();

// const allInstances =
//   new Set<Instance>();

// /* =========================
//    JSX factory
// ========================= */

// export function h<P extends Props>(
//   type: string | Component<P>,
//   props: P | null,
//   ...children: Children
// ): VNode {
//   if (typeof type === "string") {
//     return {
//       type,
//       props: props ?? {},
//       children,
//     };
//   }

//   return {
//     type,
//     props: props ?? ({} as P),
//     children: [],
//   };
// }

// export function Fragment(
//   props: { children?: Children }
// ): FragmentVNode {
//   return {
//     type: "fragment",
//     props: {},
//     children: props.children ?? [],
//   };
// }

// /* =========================
//    Prop handling
// ========================= */

// function setProps(
//   el: Element,
//   props: Record<string, unknown>
// ): void {
//   for (const key in props) {
//     if (key === "$key") continue;

//     const value = props[key];

//     if (
//       key.startsWith("on") &&
//       typeof value === "function"
//     ) {
//       const event = key.slice(2).toLowerCase();

//       el.addEventListener(
//         event,
//         value as EventListener
//       );

//       continue;
//     }

//     if (key === "style" && value) {
//       Object.assign(
//         (el as HTMLElement).style,
//         value
//       );
//       continue;
//     }

//     if (value == null) continue;

//     el.setAttribute(key, String(value));
//   }
// }

// /* =========================
//    DOM creation
// ========================= */

// function createDom(child: Child): Node {
//   if (
//     child === null ||
//     child === undefined ||
//     child === false
//   ) {
//     return document.createTextNode("");
//   }

//   if (
//     typeof child === "string" ||
//     typeof child === "number"
//   ) {
//     return document.createTextNode(String(child));
//   }

//   if (typeof child.type === "function") {
//     return mountComponent(child);
//   }

//   if (child.type === "fragment") {
//     const frag =
//       document.createDocumentFragment();

//     for (const c of child.children) {
//       frag.appendChild(createDom(c));
//     }

//     return frag;
//   }

//   const el = document.createElement(child.type);

//   setProps(el, child.props);

//   for (const c of child.children) {
//     el.appendChild(createDom(c));
//   }

//   return el;
// }

// /* =========================
//    Instance registry helpers
// ========================= */

// function registerInstance(
//   instance: Instance,
//   component: Component,
//   key?: string
// ): void {
//   allInstances.add(instance);

//   let set =
//     componentRegistry.get(component);

//   if (!set) {
//     set = new Set();
//     componentRegistry.set(component, set);
//   }

//   set.add(instance);

//   if (key) {
//     let keySet = keyRegistry.get(key);

//     if (!keySet) {
//       keySet = new Set();
//       keyRegistry.set(key, keySet);
//     }

//     keySet.add(instance);
//   }
// }

// /* =========================
//    Component mounting
// ========================= */

// function mountComponent<P extends Props>(
//   vnode: ComponentVNode<P>
// ): Node {
//   const cleanups: (() => void)[] = [];

//   let instance!: Instance<P>;

//   const ctx: ComponentContext = {
//     render(): void {
//       const newDom = createDom(instance.vnode);

//       instance.dom.replaceWith(newDom);

//       instance.dom = newDom;
//     },

//     onUnmount(fn): void {
//       cleanups.push(fn);
//     },
//   };

//   const rendered =
//     vnode.type(vnode.props, ctx);

//   const dom = createDom(rendered);

//   instance = {
//     vnode: rendered,
//     dom,
//     component: vnode.type,
//     props: vnode.props,
//     render: ctx.render,
//     cleanups,
//   };

//   const key =
//     typeof vnode.props.$key === "string"
//       ? vnode.props.$key
//       : undefined;

//   registerInstance(instance, vnode.type, key);

//   return dom;
// }

// /* =========================
//    Root render
// ========================= */

// export function render(
//   vnode: VNode,
//   container: HTMLElement
// ): void {
//   container.innerHTML = "";
//   container.appendChild(createDom(vnode));
// }

// /* =========================
//    Global rerender APIs
// ========================= */

// export function rerender(
//   component: Component
// ): void {
//   const set =
//     componentRegistry.get(component);

//   if (!set) return;

//   for (const instance of set) {
//     instance.render();
//   }
// }

// export function rerenderByKey(
//   key: string
// ): void {
//   const set = keyRegistry.get(key);

//   if (!set) return;

//   for (const instance of set) {
//     instance.render();
//   }
// }

// export function rerenderAll(): void {
//   for (const instance of allInstances) {
//     instance.render();
//   }
// }

// /* =========================
//    JSX typing
// ========================= */

// type RinStyle =
//   Partial<CSSStyleDeclaration>;

// type RinSpecialProps = {
//   $key?: string;
// };

// interface DataAttributes {
//   [key: `data-${string}`]:
//     | string
//     | number
//     | undefined;
// }

// type RinHTMLProps<T extends HTMLElement> =
//   Partial<T> &
//   Partial<GlobalEventHandlers> &
//   Partial<HTMLOrSVGElement> &
//   DataAttributes &
//   RinSpecialProps & {
//     class?: string;
//     for?: string;
//     style?: RinStyle;
//     children?: Children;
//   };

// type RinSVGProps<T extends SVGElement> =
//   Partial<T> &
//   Partial<GlobalEventHandlers> &
//   RinSpecialProps & {
//     children?: Children;
//   };

// declare global {
//   namespace JSX {
//     type Element = VNode;

//     interface IntrinsicElements {
//       [K in keyof HTMLElementTagNameMap]:
//         RinHTMLProps<
//           HTMLElementTagNameMap[K]
//         >;

//       [K in keyof SVGElementTagNameMap]:
//         RinSVGProps<
//           SVGElementTagNameMap[K]
//         >;
//     }
//   }
// }
