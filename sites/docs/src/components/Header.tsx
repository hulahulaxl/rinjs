import type { ComponentContext } from "rin-lib";

export default function Header(
  _props: Record<string, unknown>,
  _ctx: ComponentContext
) {
  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar", { detail: true }));
  };

  return () => (
    <header class="sticky top-0 z-50 w-full h-14 border-b border-zinc-200 bg-white/90 backdrop-blur-sm flex items-center">
      <div class="w-full max-w-screen-xl mx-auto px-6 flex items-center justify-between gap-6">
        {/* Left: Hamburger + Logo + Nav */}
        <div class="flex items-center gap-6">
          <button
            type="button"
            onclick={openSidebar}
            class="lg:hidden -ml-1 p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Open menu"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.75"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <a
            href="/"
            class="flex items-center gap-2 text-zinc-900 font-semibold text-sm tracking-tight"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 2 22 22 22" />
            </svg>
            <span>rin</span>
          </a>

          <nav class="hidden md:flex items-center gap-1">
            <a
              href="/"
              class="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Home
            </a>
            <a
              href="/guide"
              class="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Guide
            </a>
            <a
              href="/api"
              class="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              API
            </a>
          </nav>
        </div>

        {/* Right: Search + Divider + GitHub */}
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="hidden sm:flex items-center gap-2 h-8 pl-3 pr-2 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-300 hover:bg-white transition-colors"
          >
            <svg
              class="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span class="text-xs text-zinc-400">Search</span>
            <kbd class="ml-2 font-mono text-[10px] text-zinc-300 border border-zinc-200 rounded px-1 py-0.5">
              ⌘K
            </kbd>
          </button>

          <div class="w-px h-4 bg-zinc-200" />

          <a
            href="https://github.com/hulahulaxl/rin"
            target="_blank"
            rel="noreferrer"
            class="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="GitHub"
          >
            <svg
              class="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
