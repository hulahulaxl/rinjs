import type { ComponentContext, VNode } from "rin-lib";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { type NavSection } from "../config/navigation";

interface DocsWrapperProps {
  nav: NavSection[];
  currentPath: string;
  children?: VNode | string | (VNode | string)[];
}

export default function DocsWrapper(props: DocsWrapperProps, ctx: ComponentContext) {
  let isOpen = false;

  const toggleSidebar = (val: boolean) => {
    isOpen = val;
    ctx.rerender();
  };

  return () => (
    <div class="min-h-screen flex flex-col">
      <Header onMenuToggle={() => toggleSidebar(true)} />
      
      <div class="flex-1 w-full max-w-5xl mx-auto px-6 lg:px-8">
        <div class="lg:flex lg:gap-10">
          <Sidebar 
            nav={props.nav} 
            currentPath={props.currentPath} 
            isOpen={isOpen} 
            onClose={() => toggleSidebar(false)} 
          />
          
          <main class="flex-1 py-10 lg:py-16 min-w-0">
            {props.children}
          </main>
        </div>
      </div>
    </div>
  );
}
