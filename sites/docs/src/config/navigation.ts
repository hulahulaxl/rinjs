export interface NavItem {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const GUDIE_NAV: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/guide/introduction" },
      { title: "Getting Started", href: "/guide/getting-started" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "JSX in Rin", href: "/guide/jsx" },
      { title: "Reactivity", href: "/guide/reactivity" },
      { title: "Hydration", href: "/guide/hydration" },
    ],
  },
];

export const API_NAV: NavSection[] = [
  {
    title: "Core API",
    items: [
      { title: "jsx / jsxs", href: "/api/jsx" },
      { title: "mount", href: "/api/mount" },
      { title: "patchDOM", href: "/api/patch" },
    ],
  },
  {
    title: "Hooks & Lifecycle",
    items: [
      { title: "onMount", href: "/api/on-mount" },
      { title: "onUnmount", href: "/api/on-unmount" },
    ],
  },
];
