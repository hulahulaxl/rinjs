import type { AstroIntegration } from "astro";

export default function cuek(): AstroIntegration {
  return {
    name: "astro-cuek",
    hooks: {
      "astro:config:setup": ({ addRenderer, updateConfig }) => {
        addRenderer({
          name: "astro-cuek",
          serverEntrypoint: "astro-cuek/server",
          clientEntrypoint: "astro-cuek/client",
        });

        updateConfig({
          vite: {
            esbuild: {
              jsxImportSource: "cuekjs",
              jsx: "automatic",
            },
            optimizeDeps: {
              include: ["cuekjs"],
            },
          },
        });
      },
    },
  };
}
