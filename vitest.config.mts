import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Everything under test is pure -- no React, no DOM, no three.js -- so
 * there is no jsdom here and no testing-library. The one exception is
 * the served-HTML guard, which reads the build output off disk rather
 * than rendering anything.
 *
 * The alias mirrors the `paths` entry in tsconfig.json. It is the only
 * configuration these tests need: the modules import `@/content` and
 * expect the real record, because a test that asserts against a fixture
 * of the record cannot catch the record and the page disagreeing.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
