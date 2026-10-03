/**
 * @file tests/unit/scripts/axe.test.ts
 * @desc scripts/axe.ts: it checks every HTML route (the pages plus a docs page per library) at a
 *       desktop and a phone width with WCAG 2.2 AA tags, trims axe's result to one line per
 *       violation with its targets, and gives up on a server that never answers.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sat Oct 3, 2026
 */

import { describe, expect, it } from "vitest";
import { LIBRARIES } from "@/constants/libraries";
import { PAGE_PATHS } from "@/constants/site";
import {
  AXE_TAGS,
  axePages,
  collectViolations,
  formatViolation,
  VIEWPORTS,
  waitForServer,
} from "../../../scripts/axe";

describe("axePages", () => {
  it("lists every page in PAGES and a docs page per library, nothing twice", () => {
    const pages = axePages();
    for (const path of PAGE_PATHS) expect(pages).toContain(path);
    for (const library of LIBRARIES) expect(pages).toContain(`/libraries/${library.name}`);
    expect(new Set(pages).size).toBe(pages.length);
    expect(pages).toHaveLength(PAGE_PATHS.length + LIBRARIES.length);
  });
});

describe("VIEWPORTS and AXE_TAGS", () => {
  it("checks a desktop and a phone width against WCAG 2.2 AA and best practices", () => {
    expect(Object.keys(VIEWPORTS)).toEqual(["desktop", "phone"]);
    expect(VIEWPORTS.phone.width).toBeLessThan(VIEWPORTS.desktop.width);
    expect(AXE_TAGS).toContain("wcag22aa");
    expect(AXE_TAGS).toContain("best-practice");
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
