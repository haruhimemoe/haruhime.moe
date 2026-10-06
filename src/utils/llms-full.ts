/**
 * @file src/utils/llms-full.ts
 * @desc Builds /llms-full.txt (llmstxt.org) with @haruhimemoe/next-kit/docs's contentLlmsFull: the
 *       brand page's facts, each library's docs page (its real description and links) and each
 *       loaded repo's newest changelog entries, then every legal page from the content registry
 *       (content/legal/*.mdx, read as its .md mirror), each as its own document. Built from
 *       BRAND_COLORS, TOOLS, LIBRARIES, the fetched changelogs and the MDX files, so nothing here
 *       is invented and a new library, repo or legal change shows up on its own. Shared by the
 *       route handler and its tests; the legal pages are read from disk.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Tue Oct 6, 2026
 */

import { palette } from "@haruhimemoe/brand/palette";
import { type ContentSection, contentLlmsFull } from "@haruhimemoe/next-kit/docs";
import { readContentMarkdown } from "@haruhimemoe/next-kit/docs/files";
import type { LlmsFullPart } from "@haruhimemoe/next-kit/seo";
import { BRAND_COLORS } from "@/constants/brand";
import { type ChangelogSource, changelogUrls } from "@/constants/changelogs";
import { CONTENT } from "@/constants/content";
import { LIBRARIES, type Library, libraryUrls } from "@/constants/libraries";
import { SEO_SITE } from "@/constants/seo";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { type Changelog, sectionMarkdown } from "@/utils/changelog";
import type { ChangelogResult } from "@/utils/changelog-feed";
import { CONTENT_MARKDOWN_LEGAL } from "@/utils/content-markdown";

/**
 * @function brandPart
 * @returns {LlmsFullPart} /brand as Markdown: the name rule, the color tokens and the product
 *   family's hues (BRAND_COLORS and TOOLS, the same data the page reads), type and the osu! notice
 */
const brandPart = (): LlmsFullPart => {
  const colors = BRAND_COLORS.map((color) => `- ${color.name}: ${color.hex}`).join("\n");
  const family = TOOLS.map(
    (tool) => `- ${tool.name} (hue ${tool.hue}, ${palette(tool.hue).h1})`,
  ).join("\n");
  const markdown = [
    `The name is written "haruhime.moe" in lower case, or "haruhime" when you mean the person. ` +
      `The tools are "packs", "pools", "bb" and "sheets", also lower case. Not "Haruhime" or ` +
      `"HaruHime".`,
    "",
    "## Colors",
    "",
    colors,
    "",
    "## Product family",
    "",
    "Each tool has its own icon and hue; the rest of its palette follows from the hue.",
    "",
    family,
    "",
    "## Type",
    "",
    "Nunito (Google Fonts, SIL Open Font License) in regular, bold, and extra bold.",
    "",
    "## osu!",
    "",
    SITE.trademarkNotice,
  ].join("\n");
  return { title: "Brand", url: `${SITE.url}/brand`, markdown };
};

/**
 * @function libraryPart
 * @param library {Library} a library from LIBRARIES
 * @returns {LlmsFullPart} the library's docs page as Markdown: its real description (the same
 *   sentence /libraries/<name> reads from LIBRARIES), the install line, and its npm, GitHub and
 *   changelog links
 */
const libraryPart = (library: Library): LlmsFullPart => {
  const urls = libraryUrls(library);
  const markdown = [
    library.description,
    "",
    `Install: \`bun add ${library.pkg}\``,
    "",
    `- [npm](${urls.npm})`,
    `- [GitHub](${urls.github})`,
    `- [Changelog](${SITE.url}${urls.changelogPage})`,
  ].join("\n");
  return { title: library.pkg, url: `${SITE.url}${urls.docs}`, markdown };
};

/** How many releases each repo's llms-full document carries, newest first. */
const RELEASES_PER_REPO = 3;

/**
 * @function changelogPart
 * @param source {ChangelogSource} a repo
 * @param changelog {Changelog} its parsed changelog
 * @returns {LlmsFullPart} its page here as Markdown: the newest three releases, each section as a
 *   list
 */
export const changelogPart = (source: ChangelogSource, changelog: Changelog): LlmsFullPart => {
  const releases = changelog.releases.slice(0, RELEASES_PER_REPO);
  const markdown = releases.length
    ? releases
        .map((release) =>
          [
            `## ${release.version}${release.date ? ` (${release.date})` : ""}`,
            ...release.sections.flatMap((section) => [
              "",
              `### ${section.name}`,
              "",
              sectionMarkdown(section),
            ]),
          ].join("\n"),
        )
        .join("\n\n")
    : "No releases yet.";
  return {
    title: `${source.label} changelog`,
    url: `${SITE.url}${changelogUrls(source).page}`,
    markdown,
  };
};

/**
 * @function readLegal
 * @param section {ContentSection} a content section (only legal here)
 * @param slug {string} a registered slug
 * @returns {Promise<string>} the page's Markdown mirror, or "" when it isn't registered
 */
const readLegal = (section: ContentSection, slug: string): Promise<string> =>
  readContentMarkdown(CONTENT, section, slug, CONTENT_MARKDOWN_LEGAL).then((md) => md ?? "");

/**
 * @function buildLlmsFull
 * @param changelogs {readonly ChangelogResult[]} every fetched repo (default none)
 * @returns {Promise<string>} the llms-full.txt body (next-kit's contentLlmsFull): the brand page,
 *   every library's docs page and each loaded repo's changelog, then every legal page from the
 *   content registry, each as its own document, ending with a trailing newline
 */
export const buildLlmsFull = (changelogs: readonly ChangelogResult[] = []): Promise<string> =>
  contentLlmsFull({
    site: SEO_SITE,
    title: `${SITE.name}: brand, libraries, changelogs and legal`,
    summary: SITE.description,
    content: CONTENT,
    read: readLegal,
    before: [
      brandPart(),
      ...LIBRARIES.map(libraryPart),
      ...changelogs.flatMap((result) =>
        "changelog" in result ? [changelogPart(result.source, result.changelog)] : [],
      ),
    ],
  });
