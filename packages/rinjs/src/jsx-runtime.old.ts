// /* =========================
//    JSX typing
// ========================= */

// import { type Children, Fragment, h, type VNode } from "rinjs";

// export { h as jsx };
// export { h as jsxs };
// export { h as jsxDEV };
// export { Fragment };

// type RinStyle = Partial<CSSStyleDeclaration>;

// type RinSpecialProps = {
//   $key?: string;
// };

// interface DataAttributes {
//   [key: `data-${string}`]: string | number | undefined;
// }

// type RinHTMLProps<T extends HTMLElement> = Partial<GlobalEventHandlers> &
//   Partial<HTMLOrSVGElement> &
//   DataAttributes &
//   RinSpecialProps & {
//     class?: string;
//     for?: string;
//     style?: RinStyle;
//     children?: Children;
//   };

// type RinSVGProps<T extends SVGElement> = Partial<T> &
//   Partial<GlobalEventHandlers> &
//   RinSpecialProps & {
//     children?: Children;
//   };

// type RinIntrinsicHTML = {
//   [K in keyof HTMLElementTagNameMap]: RinHTMLProps<HTMLElementTagNameMap[K]>;
// };

// type RinIntrinsicSVG = {
//   [K in keyof SVGElementTagNameMap]: RinSVGProps<SVGElementTagNameMap[K]>;
// };

// type RinIntrinsicElements = RinIntrinsicHTML & RinIntrinsicSVG;

// /* eslint-disable @typescript-eslint/no-namespace */
// export namespace JSX {
//   export type Element = VNode;

//   export interface ElementChildrenAttribute {
//     children: {}; // eslint-disable-line @typescript-eslint/no-empty-object-type
//   }

//   export type IntrinsicElements = RinIntrinsicElements;
// }
