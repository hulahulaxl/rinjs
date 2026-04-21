import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rin from "astro-rin";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  integrations: [rin(), mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  },
  vite: {
    plugins: [tailwindcss()] as any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
});
