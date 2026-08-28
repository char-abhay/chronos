import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // React Three Fiber is an imperative renderer: a frame loop exists to
    // mutate camera, material and mesh objects in place, sixty times a
    // second. react-hooks/immutability encodes the opposite assumption --
    // that nothing is written after render -- so inside the scene it
    // reports the pattern the library is built on rather than a defect.
    //
    // Scoped to this directory and to that single rule on purpose.
    // react-hooks/purity and react-hooks/refs stay ON here, because those
    // two DO catch real bugs in scene code (unseeded randomness that
    // reshuffles on remount, refs read during render).
    files: ["src/components/three/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
