/**
 * @file vitest.config.ts
 * @desc Vitest config: three projects (unit / components / integration) over the tests/ tree,
 *       the @ path alias, v8 coverage with a 90% floor on src/utils. integration is node, like
 *       unit, but for route handlers (tests/integration/app/api/**) that mock @/lib/db and
 *       @/lib/auth instead of hitting a real database.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
 */

import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(root, "src") },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**"],
      reporter: ["text", "html"],
      thresholds: {
        "src/utils/**": { lines: 90, functions: 90, branches: 90, statements: 90 },
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
          // A timezone west of UTC so date formatting bugs surface in tests.
          env: { TZ: "America/Los_Angeles" },
        },
      },
      {
        extends: true,
        test: {
          name: "components",
          environment: "jsdom",
          include: ["tests/components/**/*.test.tsx"],
          setupFiles: ["tests/setup/components.ts"],
          // @haruhimemoe/ui's CommandPalette imports next/navigation.js itself; inlining the
          // package (instead of letting Vitest externalize it) lets vi.mock("next/navigation.js")
          // intercept that import too.
          server: { deps: { inline: [/@haruhimemoe\/ui/] } },
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          env: { TZ: "America/Los_Angeles" },
        },
      },
    ],
  },
});
