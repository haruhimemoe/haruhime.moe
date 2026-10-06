/**
 * @file tests/unit/utils/llms-txt.test.ts
 * @desc buildLlmsTxt: llmstxt.org order (the link groups as notes, then Legal from the registry), the what-it-is note with the ppy notice,
 *       absolute links, packs' and pools' own llms.txt linked, pools in beta with its sources, no
 *       dead links for tools without a url (a coming-soon note instead), every PAGE_PATHS entry
 *       present, every CHANGELOG_SOURCES entry linked under Changelogs, the Discord server under
 *       Elsewhere, every legal page's .md mirror under Legal, one trailing newline. toolLink and comingSoonNote on their own.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { CONTENT } from "@/constants/content";
import { PAGE_PATHS, SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { buildLlmsTxt, comingSoonNote, toolLink } from "@/utils/llms-txt";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt();

  it("opens with the title, a summary blockquote, then the sections in order", () => {
    const headingOrder = [...text.matchAll(/^(#|##) .+$/gm)].map((m) => m[0]);
    // No Docs, Guides or API: haruhime.moe has none, so Legal is the only section.
    expect(headingOrder).toEqual([`# ${SITE.name}`, "## Legal"]);
    const groups = ["Tools:", "Pages:", "Changelogs:", "Elsewhere:", "## Legal"];
    const at = groups.map((label) => text.indexOf(`\n${label}\n`));
    expect(at.every((i) => i > 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(text).toContain(`> ${SITE.description}`);
  });

  it("links every repo's changelog page", () => {
    for (const source of CHANGELOG_SOURCES) {
      expect(text).toContain(
        `- [${source.label} changelog](${SITE.url}/changelog/${source.slug}): every ${source.label} release, newest first`,
      );
    }
  });

  it("links every live tool with its tagline, and never links a tool without a url", () => {
    for (const tool of TOOLS) {
      if (tool.url) {
        expect(text).toContain(`- [${tool.name}](${tool.url}): ${tool.tagline}.`);
      } else {
        expect(text).not.toContain(`[${tool.name}]`);
        expect(text).toContain(`${tool.name} (${tool.tagline})`);
      }
    }
  });

  it("says what the site is, that the tools are free, and that ppy isn't involved", () => {
    expect(text).toContain("is the home page of haruhime's osu! tools");
    expect(text).toContain("free to use");
    expect(text).toContain(SITE.trademarkNotice);
  });

  it("links packs' and pools' own llms.txt", () => {
    expect(text).toContain("https://packs.haruhime.moe/llms.txt");
    expect(text).toContain("https://pools.haruhime.moe/llms.txt");
  });

  it("lists pools as live, in beta, with its sources and what it does", () => {
    const pools = text.split("\n").find((line) => line.startsWith("- [pools]"));
    expect(pools).toMatch(/^- \[pools\]\(https:\/\/pools\.haruhime\.moe\): .+\. In beta\. /);
    expect(pools).toContain("from several sources");
    expect(pools).not.toContain("coming soon");
  });

  it("lists every PAGE_PATHS entry as a titled, absolute link", () => {
    for (const path of PAGE_PATHS) {
      expect(text).toMatch(new RegExp(`^- \\[[A-Z][A-Za-z]*\\]\\(${SITE.url}${path}\\): `, "m"));
    }
    expect(text).toContain(`- [Thanks](${SITE.url}/thanks): `);
    expect(text).toContain(`- [UI](${SITE.url}/ui): `);
    expect(text).toContain(`- [Libraries](${SITE.url}/libraries): `);
    expect(text).not.toContain(`${SITE.url}/terms`);
    expect(text).not.toContain(`${SITE.url}/privacy`);
    expect(text).not.toContain(`[${SITE.url}`);
  });

  it("links every legal page's Markdown mirror under Legal, from the registry", () => {
    const legal = text.slice(text.indexOf("## Legal"));
    for (const entry of CONTENT.entries.legal) {
      expect(legal).toContain(
        `- [${entry.title}](${SITE.url}/legal/${entry.slug}.md): ${entry.description}`,
      );
    }
  });

  it("links elsewhere: GitHub org, the Claude Code plugin, npm, and the Discord server", () => {
    expect(text).toContain(SITE.githubOrg);
    expect(text).toContain("https://github.com/haruhimemoe/claude-plugin");
    expect(text).toContain("https://www.npmjs.com/org/haruhimemoe");
    const elsewhere = text.slice(text.indexOf("\nElsewhere:\n"));
    expect(elsewhere).toMatch(/^- \[Discord\]\(https:\/\/haruhime\.moe\/discord\): .+$/m);
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

describe("toolLink", () => {
  it("adds the see-also note only for a tool that serves its own llms.txt", () => {
    expect(
      toolLink({
        name: "packs",
        hue: 333,
        tagline: "packs stuff",
        icon: "x",
        url: "https://packs.example",
        llmsTxt: true,
      }),
    ).toEqual({
      title: "packs",
      url: "https://packs.example",
      note: "packs stuff. See also its own llms.txt: https://packs.example/llms.txt",
    });
    expect(
      toolLink({
        name: "widgets",
        hue: 1,
        tagline: "widget stuff",
        icon: "x",
        url: "https://widgets.example",
      }),
    ).toEqual({ title: "widgets", url: "https://widgets.example", note: "widget stuff." });
  });

  it("says a beta tool is in beta, then what it does, before the see-also note", () => {
    expect(
      toolLink({
        name: "gadgets",
        hue: 1,
        tagline: "gadget stuff",
        icon: "x",
        url: "https://gadgets.example",
        beta: true,
        about: "Makes gadgets.",
        llmsTxt: true,
      }).note,
    ).toBe(
      "gadget stuff. In beta. Makes gadgets. See also its own llms.txt: https://gadgets.example/llms.txt",
    );
  });

  it("refuses to link a tool without a url, beta or not", () => {
    expect(() =>
      toolLink({ name: "later", hue: 1, tagline: "not yet", icon: "x", beta: true }),
    ).toThrow(/hasn't launched/);
  });
});

describe("comingSoonNote", () => {
  it("names every tool without a url, with its tagline", () => {
    const soon = TOOLS.filter((tool) => !tool.url);
    expect(soon.length).toBeGreaterThan(0);
    for (const tool of soon) expect(comingSoonNote()).toContain(`${tool.name} (${tool.tagline})`);
  });

  it("is blank once every tool is live, so llms.txt drops the note", () => {
    expect(comingSoonNote(TOOLS.filter((tool) => tool.url))).toBe("");
  });
});
