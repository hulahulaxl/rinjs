import type { ComponentContext } from "rin-lib";
import { type NavSection } from "../config/navigation";

interface SidebarProps {
  nav: NavSection[];
  currentPath: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar(props: SidebarProps, _ctx: ComponentContext) {
  return () => (
    <>
      {/* Mobile Backdrop */}
      {props.isOpen && (
        <div 
          class="fixed inset-0 z-40 bg-white/60 backdrop-blur-sm lg:hidden transition-opacity"
          onclick={props.onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        class={`
          fixed inset-y-0 left-0 z-50 w-full max-w-[280px] bg-white border-r border-zinc-100 px-6 py-10 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-0 lg:w-64 lg:px-0 lg:py-0 lg:bg-transparent lg:border-none
          ${props.isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav class="space-y-8">
          {props.nav.map((section) => (
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-900 border-l-2 border-black pl-3">
                {section.title}
              </h4>
              <ul class="space-y-1">
                {section.items.map((item) => (
                  <li>
                    <a
                      href={item.href}
                      class={`
                        block text-sm py-2 px-3 rounded-md transition-all
                        ${
                          props.currentPath === item.href
                            ? "bg-zinc-100 text-black font-bold border-l-2 border-black -ml-[2px]"
                            : "text-zinc-500 hover:text-black hover:bg-zinc-50"
                        }
                      `}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
