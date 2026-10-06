/**
 * @file tests/unit/content/legal-content.test.ts
 * @desc The legal pages' required clauses, read from their .md mirrors (legal blocks included,
 *       through CONTENT_MARKDOWN_LEGAL): each page's headed sections in order, the clauses that
 *       protect us, the contact address, and a link to every live tool's own terms and privacy
 *       policy (none for a tool that hasn't launched), so a tool going live fails here until its
 *       links are added to the MDX.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { readContentMarkdown } from "@haruhimemoe/next-kit/docs/files";
import { describe, expect, it } from "vitest";
import { CONTENT } from "@/constants/content";
import { LEGAL_SITE } from "@/constants/legal-site";
import { TOOLS } from "@/constants/tools";
import { CONTENT_MARKDOWN_LEGAL } from "@/utils/content-markdown";

const read = async (slug: string): Promise<string> =>
  (await readContentMarkdown(CONTENT, "legal", slug, CONTENT_MARKDOWN_LEGAL)) ?? "";

const headings = (md: string): string[] =>
  [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1] as string);

const MAIL = `[haruhime@haruhime.moe](mailto:haruhime@haruhime.moe)`;

describe("disclaimers", () => {
  it("keeps its sections and clauses", async () => {
    const md = await read("disclaimers");
    expect(headings(md)).toEqual([
      "Not affiliated",
      "The osu! API and the hinai mirror",
      "Beatmaps belong to their creators",
      "Disclaimer of warranties",
      "Limitation of liability",
      "Made with AI help",
      "Contact",
    ]);
    expect(md).toContain("not affiliated with or endorsed by ppy Pty Ltd");
    expect(md).toContain("they don't host them or claim them");
    expect(md).toContain(`${LEGAL_SITE.siteName} is provided "as is"`);
    expect(md).toContain(MAIL);
  });
});

describe("terms", () => {
  it("keeps its sections and clauses", async () => {
    const md = await read("terms");
    expect(headings(md)).toEqual([
      "What this site is",
      "The libraries",
      "Each tool has its own terms",
      "Not affiliated",
      "Disclaimer of warranties",
      "Limitation of liability",
      "Changes",
      "Contact",
    ]);
    expect(md).toContain("released under the MIT license");
    expect(md).toContain(`${LEGAL_SITE.siteName} is provided "as is"`);
    expect(md).toContain("isn't affiliated with or endorsed by ppy Pty Ltd");
    expect(md).toContain(MAIL);
  });
});

describe("privacy", () => {
  it("keeps its sections and clauses", async () => {
    const md = await read("privacy");
    expect(headings(md)).toEqual([
      "What we store",
      "Service providers",
      "Each tool has its own policy",
      "Changes",
      "Contact",
    ]);
    expect(md).toContain("has no accounts, sets no cookies, runs no analytics");
    expect(md).toContain("**[Vercel](https://vercel.com/legal/privacy-policy)**");
    expect(md).toContain("your browser never contacts npm or GitHub");
    expect(md).toContain(MAIL);
  });
});

describe("your-privacy-rights", () => {
  it("keeps its sections and clauses", async () => {
    const md = await read("your-privacy-rights");
    expect(headings(md)).toEqual([
      "Your rights",
      "Your rights under the GDPR",
      "Your rights under the CCPA",
      "Changes",
    ]);
    expect(md).toContain("itself keeps nothing of yours");
    expect(md).toContain("We don't sell or share personal information.");
    expect(md).toContain("We honor Global Privacy Control signals.");
    expect(md).toContain(MAIL);
  });
});

describe("copyright", () => {
  it("keeps its sections and clauses", async () => {
    const md = await read("copyright");
    expect(headings(md)).toEqual(["What we host", "Copyright and DMCA", "Contact"]);
    expect(md).toContain("hosts no beatmaps, maps or other user files itself");
    expect(md).toContain("A takedown notice should include");
    expect(md).toContain("A counter-notice should include");
    expect(md).toContain(MAIL);
  });
});

describe.each([
  ["terms", "terms"],
  ["privacy", "privacy policy"],
] as const)("%s", (slug, label) => {
  it("links every live tool's own page, and no tool that hasn't launched", async () => {
    const md = await read(slug);
    for (const tool of TOOLS) {
      if (tool.url) expect(md).toContain(`- [${tool.name} ${label}](${tool.url}/legal/${slug})`);
      else expect(md).not.toContain(`[${tool.name} `);
    }
  });
});
