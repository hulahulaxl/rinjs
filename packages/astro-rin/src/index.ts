import type { AstroIntegration } from "astro";

export default function rin(): AstroIntegration {
  return {
    name: "astro-rin",
    hooks: {
      "astro:config:setup": ({ addRenderer, updateConfig }) => {
        addRenderer({
          name: "astro-rin",
          serverEntrypoint: "astro-rin/server",
          clientEntrypoint: "astro-rin/client",
        });

        updateConfig({
          vite: {
            esbuild: {
              jsxImportSource: "rin-lib",
              jsx: "automatic",
            },
            optimizeDeps: {
              include: ["rin-lib"],
            },
          },
        });
      },
    },
  };
}
