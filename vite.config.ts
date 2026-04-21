import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "packages/cuek/src/index.ts"),
      name: "Cuek",
      fileName: "cuek",
    },
  },
});
