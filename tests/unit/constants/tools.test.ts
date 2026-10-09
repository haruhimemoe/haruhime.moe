/**
 * @file tests/unit/constants/tools.test.ts
 * @desc Tools: packs and pools live, pools in beta, bb and sheets not yet; what pools says about its
 *       sources; icons exist; hues match the brand kit.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { hslToHex } from "@haruhimemoe/brand/palette";
import { describe, expect, it } from "vitest";
import { TOOLS } from "@/constants/tools";

describe("TOOLS", () => {
  it("lists packs, pools, bb, harumin, tourney and sheets in that order", () => {
    expect(TOOLS.map((tool) => tool.name)).toEqual([
      "packs",
      "pools",
      "bb",
      "harumin",
      "tourney",
      "sheets",
    ]);
  });

  it("links packs, pools, bb, harumin and tourney; sheets waits for its launch", () => {
    expect(TOOLS.filter((tool) => tool.url).map((tool) => tool.name)).toEqual([
      "packs",
      "pools",
      "bb",
      "harumin",
      "tourney",
    ]);
    expect(TOOLS[4]?.url).toBe("https://tourney.haruhime.moe");
    expect(TOOLS[3]?.url).toBe("https://harumin.haruhime.moe");
    expect(TOOLS[2]?.url).toBe("https://bb.haruhime.moe");
    expect(TOOLS[0]?.url).toBe("https://packs.haruhime.moe");
    expect(TOOLS[1]?.url).toBe("https://pools.haruhime.moe");
  });

  it("marks pools and tourney as beta; beta and llmsTxt are for live tools only", () => {
    expect(TOOLS.filter((tool) => tool.beta).map((tool) => tool.name)).toEqual([
      "pools",
      "tourney",
    ]);
    for (const tool of TOOLS.filter((t) => t.beta || t.llmsTxt)) {
      expect(tool.url).toBeDefined();
    }
  });

  it("says pools has several sources, never that every pool comes from otdb", () => {
    const about = TOOLS[1]?.about ?? "";
    expect(about).toMatch(/several sources \(tournament hosts, community submissions and otdb\)/);
    expect(about).not.toMatch(/(every|all) pools?\b[^.]*otdb/i);
  });

  it.each(TOOLS.map((tool) => [tool.name, tool] as const))(
    "%s has its generated icon, drawn without text",
    (_name, tool) => {
      const file = path.join(process.cwd(), "public", tool.icon);
      expect(existsSync(file)).toBe(true);
      const svg = readFileSync(file, "utf8");
      expect(svg).toContain(`aria-label="${tool.name}"`);
      expect(svg).not.toContain("<text");
    },
  );

  it("uses the brand kit's hues (pools h1 is #66ccff)", () => {
    expect(TOOLS.map((tool) => tool.hue)).toEqual([333, 200, 265, 350, 110, 150]);
    expect(hslToHex(200, 100, 70)).toBe("#66ccff");
  });
});
