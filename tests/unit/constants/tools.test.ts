/**
 * @file tests/unit/constants/tools.test.ts
 * @desc Tools: packs live, pools and sheets not yet; icons exist; hues match the brand kit.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
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

  it("links only packs until the others launch", () => {
    expect(TOOLS.filter((tool) => tool.url).map((tool) => tool.name)).toEqual(["packs"]);
    expect(TOOLS[0]?.url).toBe("https://packs.haruhime.moe");
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
