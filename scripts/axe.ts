/**
 * @file scripts/axe.ts
 * @desc Runs axe-core in a real browser against every page of a production build
 *       (`bun run build` first), at a desktop and a phone width, with color contrast on: the
 *       jsdom tests turn contrast off because jsdom has no layout, so this is where contrast
 *       regressions show. Starts `next start` on a spare port, drives Chromium through
 *       Playwright, prints every violation and exits 1 if there are any. CI runs it after the
 *       build (`bun run test:a11y`).
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sat Oct 3, 2026
 */

import { spawn } from "node:child_process";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { LIBRARIES } from "@/constants/libraries";
import { PAGE_PATHS } from "@/constants/site";

/** One axe violation, trimmed to what a CI log needs. */
export type Violation = {
  readonly page: string;
  readonly viewport: string;
  readonly id: string;
  readonly impact: string;
  readonly help: string;
  readonly targets: readonly string[];
};

/** The widths checked: a desktop and a phone, so the header's two layouts both run. */
export const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  phone: { width: 390, height: 844 },
} as const;

/** WCAG 2.2 AA and axe's best practices. Contrast is on: this runs in a real browser. */
export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

/**
 * @function axePages
 * @returns {string[]} every HTML route: the pages in PAGES, then a docs page per library (the
 *   text routes, llms.txt and security.txt, have no DOM to check)
 */
export const axePages = (): string[] => [
  ...PAGE_PATHS,
  ...LIBRARIES.map((library) => `/libraries/${library.name}`),
];

/** The shape of axe's `analyze()` result this script reads. */
type AxeResults = {
  violations: readonly {
    id: string;
    impact?: string | null;
    help: string;
    nodes: readonly { target: readonly unknown[] }[];
  }[];
};

/**
 * @function collectViolations
 * @param page {string} the route checked
 * @param viewport {string} the viewport name
 * @param results {AxeResults} axe's result for that page at that width
 * @returns {Violation[]} one entry per violation, with up to five CSS targets each
 */
export const collectViolations = (
  page: string,
  viewport: string,
  results: AxeResults,
): Violation[] =>
  results.violations.map((violation) => ({
    page,
    viewport,
    id: violation.id,
    impact: violation.impact ?? "unknown",
    help: violation.help,
    targets: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
  }));

/**
 * @function formatViolation
 * @param violation {Violation} one violation
 * @returns {string} one line per violation plus one indented line per target, for the log
 */
export const formatViolation = (violation: Violation): string =>
  [
    `${violation.viewport} ${violation.page}: ${violation.id} (${violation.impact}) ${violation.help}`,
    ...violation.targets.map((target) => `    ${target}`),
  ].join("\n");

/**
 * @function waitForServer
 * @param url {string} the URL to poll
 * @param timeoutMs {number} how long to keep trying
 * @returns {Promise<void>} resolves once the URL answers any status
 * @throws {Error} when the server never answers in time
 */
export const waitForServer = async (url: string, timeoutMs: number): Promise<void> => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`${url} did not answer within ${timeoutMs}ms`);
};

if (import.meta.main) {
  const port = Number(process.env.AXE_PORT ?? 3987);
  const origin = `http://127.0.0.1:${port}`;
  const root = path.join(import.meta.dirname, "..");
  const server = spawn("bun", ["run", "start", "--", "-p", String(port)], {
    cwd: root,
    stdio: ["ignore", "ignore", "inherit"],
  });
  const violations: Violation[] = [];
  try {
    await waitForServer(origin, 30000);
    const browser = await chromium.launch();
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      const context = await browser.newContext({ viewport, colorScheme: "dark" });
      const page = await context.newPage();
      for (const route of axePages()) {
        const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
        if (response?.status() !== 200) {
          throw new Error(`${route} answered ${response?.status() ?? "nothing"}`);
        }
        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        const found = collectViolations(route, name, results);
        violations.push(...found);
        console.log(`${name} ${route}: ${found.length ? `${found.length} violations` : "ok"}`);
      }
      await context.close();
    }
    await browser.close();
  } finally {
    server.kill();
  }
  if (violations.length) {
    console.error(`\n${violations.map(formatViolation).join("\n")}`);
    console.error(`\n${violations.length} axe violations`);
    process.exit(1);
  }
  console.log("\nno axe violations");
}
