export const homepageData = {
  hero: {
    title: "Cuek",
    description: "The minimalist, non-reactive view library.",
    primaryCta: {
      text: "Get started",
      href: "/guide/introduction"
    },
    secondaryCta: {
      text: "View on GitHub",
      href: "https://github.com/hulahulaxl/cuek"
    }
  },
  codeSnippet: {
    filename: "Counter.tsx",
    code: `function Counter({}, ctx) {
  let count = 0;

  return () => (
    <div class="counter">
      <p>Count: {count}</p>
      <button onclick={() => { count++; ctx.rerender(); }}>
        Increment
      </button>
    </div>
  );
}`
  },
  features: [
    {
      title: "Non-Reactive by Design",
      description:
        "No hidden reactivity, proxies, or magical side effects. You have full control over state updates via explicit rerendering, making your application flow entirely predictable.",
      iconPath: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    },
    {
      title: "Feather-weight Core",
      description:
        "A tiny footprint with zero unnecessary abstractions. Cuek provides only the essential foundation needed to build fast interfaces, eliminating the overhead of traditional frameworks.",
      iconPath:
        "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
    },
    {
      title: "Vanilla HTML as JSX",
      description:
        'No framework magic. Use standard <code class="text-xs bg-zinc-100 px-1 py-0.5 rounded font-mono">onchange</code> instead of synthetic <code class="text-xs bg-zinc-100 px-1 py-0.5 rounded font-mono">onChange</code> for form inputs. Events are native, and attributes map exactly to the browser APIs.',
      iconPath:
        "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
    }
  ]
};
