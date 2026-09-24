/**
 * @file tests/unit/utils/llms-txt.test.ts
 * @desc buildLlmsTxt: llmstxt.org section order, absolute links, packs' own llms.txt linked,
 *       no dead links for tools without a url, every PAGE_PATHS entry present, one trailing
 *       newline.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { describe, expect, it } from "vitest";
import { PAGE_PATHS, SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { buildLlmsTxt, toolLine } from "@/utils/llms-txt";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt();

  it("opens with the title, a summary blockquote, then the sections in order", () => {
    const headingOrder = [...text.matchAll(/^(#|##) .+$/gm)].map((m) => m[0]);
    expect(headingOrder).toEqual([`# ${SITE.name}`, "## Tools", "## Pages", "## Elsewhere"]);
    expect(text).toContain(`> ${SITE.description}`);
  });

  it("links every live tool with its tagline, and never links a tool without a url", () => {
    for (const tool of TOOLS) {
      if (tool.url) {
        expect(text).toContain(`- [${tool.name}](${tool.url}): ${tool.tagline}.`);
      } else {
        expect(text).not.toContain(`(${tool.name})`);
        expect(text).toContain(`- ${tool.name}: ${tool.tagline} (coming soon)`);
      }
    }
  });

  it("links packs' own llms.txt", () => {
    expect(text).toContain("https://packs.haruhime.moe/llms.txt");
  });

  it("lists every PAGE_PATHS entry as a titled, absolute link", () => {
    for (const path of PAGE_PATHS) {
      expect(text).toMatch(new RegExp(`^- \\[[A-Z][A-Za-z]*\\]\\(${SITE.url}${path}\\): `, "m"));
    }
    expect(text).toContain(`- [Thanks](${SITE.url}/thanks): `);
    expect(text).toContain(`- [UI](${SITE.url}/ui): `);
    expect(text).not.toContain(`[${SITE.url}`);
  });

  it("links elsewhere: GitHub org, the Claude Code plugin, and npm", () => {
    expect(text).toContain(SITE.githubOrg);
    expect(text).toContain("https://github.com/haruhimemoe/claude-plugin");
    expect(text).toContain("https://www.npmjs.com/org/haruhimemoe");
  });

  it("uses only absolute links", () => {
    const linkUrls = [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    expect(linkUrls.length).toBeGreaterThan(0);
    for (const url of linkUrls) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("ends with exactly one trailing newline", () => {
    expect(text.endsWith("\n")).toBe(true);
    expect(text.endsWith("\n\n")).toBe(false);
  });
});

describe("toolLine", () => {
  it("adds the see-also note only for packs, never for another live tool", () => {
    expect(
      toolLine({
        name: "packs",
        hue: 333,
        tagline: "packs stuff",
        icon: "x",
        url: "https://packs.example",
      }),
    ).toBe(
      "- [packs](https://packs.example): packs stuff. See also its own llms.txt: https://packs.example/llms.txt",
    );
    expect(
      toolLine({
        name: "widgets",
        hue: 1,
        tagline: "widget stuff",
        icon: "x",
        url: "https://widgets.example",
      }),
    ).toBe("- [widgets](https://widgets.example): widget stuff.");
  });

  it("never links a tool without a url", () => {
    expect(toolLine({ name: "soon", hue: 1, tagline: "not yet", icon: "x" })).toBe(
      "- soon: not yet (coming soon)",
    );
  });
});
