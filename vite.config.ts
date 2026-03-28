import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "packages/rinjs/src/index.ts"),
      name: "RinJS",
      fileName: "rinjs",
    },
  },
});
