import { Options } from "tsup";

export const tsup: Options = {
  clean: true,
  dts: false,
  entry: ["src/**/*.ts", "src/index.ts"],
  outDir: "dist",
  format: "cjs",
  minify: false,
  keepNames: true,
  skipNodeModulesBundle: true,
  sourcemap: false,
  target: "es2021",
};
