import type { ComponentContext } from "cuek";
import { type NavSection } from "../config/navigation";

interface SidebarProps {
  nav: NavSection[];
  currentPath: string;
}

export default function Sidebar(props: SidebarProps, ctx: ComponentContext) {
  let isOpen = false;

  ctx.onMount(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      isOpen = typeof detail === "boolean" ? detail : !isOpen;
      ctx.rerender();
    };
    window.addEventListener("toggle-sidebar", handler);
    ctx.onUnmount(() => window.removeEventListener("toggle-sidebar", handler));
  });

  const close = () => {
    isOpen = false;
    ctx.rerender();
  };

  return () => (
    <div id="sidebar-container">
      {/* Backdrop */}
      <div
        class={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onclick={close}
      />

      {/* Sidebar Panel */}
      <aside
        class={`
          fixed top-0 left-0 z-50 h-screen w-60 bg-white border-r border-zinc-100 flex flex-col overflow-hidden
          transition-transform duration-250 ease-in-out
          lg:static lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 lg:translate-x-0 lg:shrink-0
          ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        `}
      >
        {/* Mobile header */}
        <div class="flex items-center justify-between px-5 h-14 border-b border-zinc-100 lg:hidden">
          <span class="text-sm font-semibold text-zinc-900">Menu</span>
          <button
            type="button"
            onclick={close}
            class="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Close menu"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav class="flex-1 overflow-y-auto px-3 py-6 space-y-6">
          {props.nav.map(section => (
            <div>
              <p class="px-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-800">
                {section.title}
              </p>
              <ul class="space-y-0.5">
                {section.items.map(item => {
                  const isActive = props.currentPath === item.href;
                  return (
                    <li>
                      <a
                        href={item.href}
                        class={`flex items-center px-2 py-1.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-zinc-100 text-zinc-900 font-medium"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
