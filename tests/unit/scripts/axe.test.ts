/**
 * @file tests/unit/scripts/axe.test.ts
 * @desc scripts/axe.ts: it checks every HTML route (the pages plus a docs page per library) at a
 *       desktop and a touch phone with WCAG 2.2 AA tags, runs /ui again under more contrast
 *       and reduced motion, trims axe's result to one line per
 *       violation with its targets, and gives up on a server that never answers.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Mon Oct 5, 2026
 */

import { describe, expect, it } from "vitest";
import { LIBRARIES } from "@/constants/libraries";
import { PAGE_PATHS } from "@/constants/site";
import {
  AXE_TAGS,
  axePages,
  CONTEXTS,
  collectViolations,
  formatViolation,
  MEDIA_RUNS,
  waitForServer,
} from "../../../scripts/axe";

describe("axePages", () => {
  it("lists every page in PAGES, /legal and each legal page, a docs page per library, a kind feed and a repo changelog", () => {
    const pages = axePages();
    for (const path of PAGE_PATHS) expect(pages).toContain(path);
    for (const slug of ["terms", "privacy", "your-privacy-rights", "copyright", "disclaimers"])
      expect(pages).toContain(`/legal/${slug}`);
    expect(pages).toContain("/legal");
    for (const library of LIBRARIES) expect(pages).toContain(`/libraries/${library.name}`);
    expect(pages).toContain("/changelog/kind/packages");
    expect(pages).toContain("/changelog/ui");
    expect(pages).toContain("/changelog/haruhime.moe");
    expect(new Set(pages).size).toBe(pages.length);
    expect(pages).toHaveLength(PAGE_PATHS.length + 6 + LIBRARIES.length + 3);
  });
});

describe("CONTEXTS, MEDIA_RUNS and AXE_TAGS", () => {
  it("checks a desktop and a touch phone against WCAG 2.2 AA and best practices", () => {
    expect(Object.keys(CONTEXTS)).toEqual(["desktop", "phone"]);
    expect(CONTEXTS.phone.viewport?.width).toBeLessThan(CONTEXTS.desktop.viewport?.width ?? 0);
    expect(CONTEXTS.phone).toMatchObject({ isMobile: true, hasTouch: true });
    expect(AXE_TAGS).toEqual([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ]);
  });
  it("runs /ui again under more contrast and reduced motion", () => {
    expect(MEDIA_RUNS.map((run) => [run.name, run.route])).toEqual([
      ["contrast-more", "/ui"],
      ["reduced-motion", "/ui"],
    ]);
    expect(MEDIA_RUNS[0]?.options).toMatchObject({ contrast: "more" });
    expect(MEDIA_RUNS[1]?.options).toMatchObject({ reducedMotion: "reduce" });
  });
});

describe("collectViolations and formatViolation", () => {
  const results = {
    violations: [
      {
        id: "color-contrast",
        impact: "serious",
        help: "Elements must meet minimum color contrast ratio thresholds",
        nodes: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ target: [`p:nth-child(${n})`] })),
      },
      {
        id: "region",
        impact: null,
        help: "All page content should be contained by landmarks",
        nodes: [],
      },
    ],
  };

  it("keeps the page, width, rule, impact and at most five targets", () => {
    const found = collectViolations("/brand", "phone", results);
    expect(found).toHaveLength(2);
    expect(found[0]).toMatchObject({ page: "/brand", viewport: "phone", id: "color-contrast" });
    expect(found[0]?.targets).toHaveLength(5);
    expect(found[1]?.impact).toBe("unknown");
    expect(found[1]?.targets).toEqual([]);
  });

  it("formats one line per violation plus an indented line per target", () => {
    const [first] = collectViolations("/brand", "phone", results);
    const text = formatViolation(first as NonNullable<typeof first>);
    const lines = text.split("\n");
    expect(lines[0]).toBe(
      "phone /brand: color-contrast (serious) Elements must meet minimum color contrast ratio thresholds",
    );
    expect(lines).toHaveLength(6);
    expect(lines[1]).toBe("    p:nth-child(1)");
  });
});

describe("waitForServer", () => {
  it("gives up with the URL in the error once the timeout passes", async () => {
    await expect(waitForServer("http://127.0.0.1:9", 300)).rejects.toThrow(
      "http://127.0.0.1:9 did not answer within 300ms",
    );
  });
});
