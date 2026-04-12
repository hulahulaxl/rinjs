import type { ComponentContext } from "rin-lib";

export default function Header(
  _props: Record<string, unknown>,
  _ctx: ComponentContext
) {
  return () => (
    <header class="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div class="mx-auto max-w-5xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <a
            href="/"
            class="text-xl font-bold tracking-tight text-zinc-900 group flex items-center gap-2"
          >
            <svg
              class="h-6 w-6 group-hover:rotate-12 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 2 22 22 22" />
            </svg>
            rin
          </a>

          <nav class="hidden md:flex gap-6 items-center">
            <a
              href="/"
              class="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
            >
              Home
            </a>
            <a
              href="/guide"
              class="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
            >
              Guide
            </a>
            <a
              href="/api"
              class="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
            >
              API Reference
            </a>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <button
            type="button"
            class="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 bg-zinc-100 hover:bg-zinc-200/80 rounded-md transition-colors border border-zinc-200/50 outline-none cursor-pointer"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="font-medium">Search...</span>
            <kbd class="ml-4 font-sans text-xs tracking-widest text-zinc-400">
              ⌘K
            </kbd>
          </button>

          <a
            href="https://github.com/hulahulaxl/rin"
            target="_blank"
            rel="noreferrer"
            class="text-zinc-500 hover:text-black transition-colors"
          >
            <span class="sr-only">GitHub</span>
            <svg
              class="h-5 w-5"
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
