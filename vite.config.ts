import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "packages/rin/src/index.ts"),
      name: "Rin",
      fileName: "rin",
    },
  },
});
