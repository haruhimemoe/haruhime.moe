/**
 * @file tests/unit/app/sitemap.test.ts
 * @desc sitemap.xml lists every page, and robots.txt allows everything and points at it.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { PAGE_PATHS } from "@/constants/site";

/** Every route path under src/app that has its own page.tsx, derived straight from the filesystem. */
const routePathsOnDisk = (): string[] => {
  const appDir = path.join(process.cwd(), "src/app");
  return readdirSync(appDir, { recursive: true })
    .filter((entry) => entry.toString().endsWith("page.tsx"))
    .map((entry) => {
      const dir = path.posix.dirname(entry.toString().split(path.sep).join("/"));
      return dir === "." ? "/" : `/${dir}`;
    })
    .sort();
};

describe("sitemap", () => {
  it("lists every page on the live domain", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://www.haruhime.moe/",
      "https://www.haruhime.moe/thanks",
      "https://www.haruhime.moe/brand",
      "https://www.haruhime.moe/ui",
      "https://www.haruhime.moe/contact",
      "https://www.haruhime.moe/disclaimer",
    ]);
  });

  it("matches every page.tsx under src/app, so a new page can't miss the sitemap", () => {
    expect([...PAGE_PATHS].sort()).toEqual(routePathsOnDisk());
  });
});

describe("robots", () => {
  it("allows everything and names the sitemap", () => {
    expect(robots()).toEqual({
      rules: [{ userAgent: "*", allow: "/" }],
      sitemap: "https://www.haruhime.moe/sitemap.xml",
    });
  });
});
