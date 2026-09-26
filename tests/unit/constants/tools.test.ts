/**
 * @file tests/unit/constants/tools.test.ts
 * @desc Tools: packs and pools live, pools in beta, sheets not yet; what pools says about its
 *       sources; icons exist; hues match the brand kit.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sat Sep 26, 2026
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TOOLS } from "@/constants/tools";
import { hslToHex } from "@/utils/color";

describe("TOOLS", () => {
  it("lists packs, pools and sheets in that order", () => {
    expect(TOOLS.map((tool) => tool.name)).toEqual(["packs", "pools", "sheets"]);
  });

  it("links packs and pools; sheets waits for its launch", () => {
    expect(TOOLS.filter((tool) => tool.url).map((tool) => tool.name)).toEqual(["packs", "pools"]);
    expect(TOOLS[0]?.url).toBe("https://packs.haruhime.moe");
    expect(TOOLS[1]?.url).toBe("https://pools.haruhime.moe");
  });

  it("marks only pools as beta; beta, about and llmsTxt are for live tools only", () => {
    expect(TOOLS.filter((tool) => tool.beta).map((tool) => tool.name)).toEqual(["pools"]);
    for (const tool of TOOLS.filter((t) => t.beta || t.about || t.llmsTxt)) {
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
    expect(TOOLS.map((tool) => tool.hue)).toEqual([333, 200, 150]);
    expect(hslToHex(200, 100, 70)).toBe("#66ccff");
  });
});
