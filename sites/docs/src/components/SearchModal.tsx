import type { ComponentContext } from "cuekjs";

interface SearchResult {
  url: string;
  meta: { title: string };
  excerpt: string;
}

export default function SearchModal(
  _props: Record<string, unknown>,
  ctx: ComponentContext
) {
  let isOpen = false;
  let query = "";
  let results: SearchResult[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pagefind: any = null;
  let searchGeneration = 0;

  const loadPagefind = async () => {
    if (!pagefind) {
      try {
        const pagefindPath = "/pagefind/pagefind.js";
        pagefind = await import(/* @vite-ignore */ pagefindPath);
        await pagefind.init();
      } catch {
        // eslint-disable-next-line no-console
        console.warn("Cuek SearchModal: pagefind not found. Is it built?");
      }
    }
  };

  const close = () => {
    isOpen = false;
    query = "";
    results = [];
    document.body.style.overflow = "";
    ctx.rerender();
  };

  const open = async () => {
    isOpen = true;
    document.body.style.overflow = "hidden";
    ctx.rerender();

    await loadPagefind();

    setTimeout(() => {
      const input = document.getElementById(
        "cuek-search-input"
      ) as HTMLInputElement | null;
      if (input) input.focus();
    }, 50);
  };

  ctx.onMount(() => {
    const handleToggle = () => {
      if (isOpen) close();
      else open();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleToggle();
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("toggle-search", handleToggle);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("toggle-search", handleToggle);
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  const handleInput = async (e: Event) => {
    query = (e.target as HTMLInputElement).value;
    if (!query.trim()) {
      ++searchGeneration; // invalidate any in-flight search
      results = [];
      ctx.rerender();
      return;
    }

    if (pagefind) {
      const generation = ++searchGeneration;
      const search = await pagefind.search(query);
      const data = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        search.results.slice(0, 5).map((r: any) => r.data())
      );
      // Discard results from a stale search (user typed again before this resolved)
      if (generation !== searchGeneration) return;
      results = data;
      ctx.rerender();
    }
  };

  return () => {
    if (!isOpen) {
      // Return a hidden root node to satisfy Cuek's single-root rule
      return (
        <div style="display:none" id="search-modal-hidden" aria-hidden="true" />
      );
    }

    return (
      <div
        class="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4"
        role="dialog"
      >
        <div
          class="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm transition-opacity"
          onclick={close}
        />

        <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-zinc-200">
          <div class="flex items-center px-4 py-4 border-b border-zinc-100">
            <svg
              class="w-5 h-5 text-zinc-400"
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
            <input
              id="cuek-search-input"
              class="flex-1 ml-3 bg-transparent text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search documentation..."
              value={query}
              oninput={handleInput}
            />
            <button
              onclick={close}
              class="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors"
            >
              Esc
            </button>
          </div>

          <div class="overflow-y-auto max-h-[60vh]">
            {query && results.length > 0 && (
              <div class="py-2">
                {results.map(result => (
                  <a
                    href={result.url}
                    class="block px-4 py-3 mx-2 my-1 rounded-lg hover:bg-zinc-50 transition-colors"
                    onclick={close}
                  >
                    <p class="text-sm font-medium text-zinc-900 mb-1">
                      {result.meta.title}
                    </p>
                    <p
                      class="text-xs text-zinc-500 line-clamp-2"
                      innerHTML={result.excerpt}
                    />
                  </a>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div class="px-6 py-14 text-center text-zinc-500">
                <p>No results found for "{query}"</p>
              </div>
            )}

            {!query && (
              <div class="px-6 py-14 text-center text-zinc-500">
                <p>Type to search the documentation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}
