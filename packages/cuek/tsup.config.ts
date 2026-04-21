import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/jsx-runtime.ts"],
  format: ["cjs", "esm"],
  treeshake: true,
  dts: true,
  clean: true,
  outDir: "dist"
});
