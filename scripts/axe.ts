/**
 * @file scripts/axe.ts
 * @desc Runs axe-core in a real browser against every page of a production build
 *       (`bun run build` first), at a desktop and a touch phone (coarse pointer, so the 44px
 *       targets are what gets measured), then /ui again under more contrast and under reduced
 *       motion, with color contrast on: the jsdom tests turn contrast off because jsdom has no
 *       layout, so this is where contrast regressions show. Starts `next start` on a spare port, drives Chromium through
 *       Playwright, prints every violation and exits 1 if there are any. CI runs it after the
 *       build (`bun run test:a11y`).
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sun Oct 4, 2026
 */

import { spawn } from "node:child_process";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { contentPath } from "@haruhimemoe/next-kit/docs";
import { type BrowserContextOptions, chromium } from "playwright";
import { CONTENT } from "@/constants/content";
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

/** The pages run at a desktop and a touch phone (coarse pointer, so 44px targets are measured). */
export const CONTEXTS = {
  desktop: { viewport: { width: 1280, height: 900 } },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
} as const satisfies Record<string, BrowserContextOptions>;

/** /ui renders every kit export, so it runs again under the media a visitor can ask for. */
export const MEDIA_RUNS = [
  {
    name: "contrast-more",
    route: "/ui",
    options: { viewport: { width: 1280, height: 900 }, contrast: "more" },
  },
  {
    name: "reduced-motion",
    route: "/ui",
    options: { viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" },
  },
] as const satisfies readonly { name: string; route: "/ui"; options: BrowserContextOptions }[];

/** WCAG 2.2 AA and axe's best practices. Contrast is on: this runs in a real browser. */
export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

/**
 * @function axePages
 * @returns {string[]} every HTML route: the pages in PAGES, /legal and each legal page, then a
 *   docs page per library, one
 *   kind feed and two repo changelogs (the text routes, llms.txt and security.txt, have no DOM to
 *   check)
 */
export const axePages = (): string[] => [
  ...PAGE_PATHS,
  "/legal",
  ...CONTENT.entries.legal.map((entry) => contentPath("legal", entry.slug)),
  ...LIBRARIES.map((library) => `/libraries/${library.name}`),
  // One kind feed and two repo changelogs stand for their routes (haruhime.moe proves a slug with
  // a dot serves a page, not a 404); /changelog is in PAGE_PATHS.
  "/changelog/kind/packages",
  "/changelog/ui",
  "/changelog/haruhime.moe",
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
    for (const [name, options] of Object.entries(CONTEXTS)) {
      const context = await browser.newContext({ ...options, colorScheme: "dark" });
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
    for (const run of MEDIA_RUNS) {
      const context = await browser.newContext({ ...run.options, colorScheme: "dark" });
      const page = await context.newPage();
      const response = await page.goto(`${origin}${run.route}`, { waitUntil: "networkidle" });
      if (response?.status() !== 200)
        throw new Error(`${run.route} answered ${response?.status() ?? "nothing"}`);
      const found = collectViolations(
        run.route,
        run.name,
        await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze(),
      );
      violations.push(...found);
      console.log(
        `${run.name} ${run.route}: ${found.length ? `${found.length} violations` : "ok"}`,
      );
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
