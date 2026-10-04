/**
 * @file tests/unit/constants/libraries.test.ts
 * @desc Libraries: the eight @haruhimemoe packages in order, unique names that are safe URL
 *       segments, isLibraryName never trusting prototype keys, libraryUrls pointing at the repo,
 *       npm, the changelog, the raw README and the docs page, and ui the only showcase.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { describe, expect, it } from "vitest";
import { isLibraryName, LIBRARIES, libraryUrls } from "@/constants/libraries";

describe("LIBRARIES", () => {
  it("lists the eight packages in order", () => {
    expect(LIBRARIES.map((lib) => lib.name)).toEqual([
      "ui",
      "next-kit",
      "osu",
      "hinai",
      "pool",
      "compliance",
      "bbcode",
      "brand",
    ]);
  });

  it("names each package @haruhimemoe/<name> with a repo of the same name", () => {
    for (const lib of LIBRARIES) {
      expect(lib.pkg).toBe(`@haruhimemoe/${lib.name}`);
      expect(lib.repo).toBe(lib.name);
      expect(lib.name).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(lib.description.length).toBeGreaterThan(20);
      expect(lib.description.length).toBeLessThan(160);
    }
  });

  it("shows only ui off at a showcase", () => {
    expect(LIBRARIES.filter((lib) => lib.showcase).map((lib) => [lib.name, lib.showcase])).toEqual([
      ["ui", "/ui"],
    ]);
  });
});

describe("isLibraryName", () => {
  it("accepts every library and nothing else", () => {
    for (const lib of LIBRARIES) expect(isLibraryName(lib.name)).toBe(true);
    for (const bad of ["", "UI", "packs", "__proto__", "constructor", "toString"]) {
      expect(isLibraryName(bad)).toBe(false);
    }
  });
});

describe("libraryUrls", () => {
  it("points at the docs page, GitHub, npm, the changelog and the raw README", () => {
    const pool = LIBRARIES.find((lib) => lib.name === "pool");
    if (!pool) throw new Error("pool missing");
    expect(libraryUrls(pool)).toEqual({
      docs: "/libraries/pool",
      github: "https://github.com/haruhimemoe/pool",
      npm: "https://www.npmjs.com/package/@haruhimemoe/pool",
      changelog: "https://github.com/haruhimemoe/pool/blob/main/CHANGELOG.md",
      changelogPage: "/changelog/pool",
      readme: "https://raw.githubusercontent.com/haruhimemoe/pool/main/README.md",
    });
  });
});

describe("README banners", () => {
  it("exist in public/brand/repos for every library, so the cards never 404", async () => {
    const { existsSync } = await import("node:fs");
    for (const lib of LIBRARIES) {
      expect(existsSync(`public/brand/repos/${lib.repo}-banner.svg`)).toBe(true);
    }
  });
});
