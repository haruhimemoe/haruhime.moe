/**
 * @file src/utils/llms-full.ts
 * @desc Builds /llms-full.txt (llmstxt.org) with @haruhimemoe/next-kit/seo's llmsFull: the brand
 *       page's facts, each library's docs page (its real description and links), each loaded
 *       repo's newest changelog entries, then the three legal pages, each as its own document.
 *       Built from BRAND_COLORS, TOOLS, LIBRARIES, the fetched changelogs and the legal pages' own
 *       copy, so nothing here is invented and a new library, repo or legal change shows up on its
 *       own. Pure so the route handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sun Oct 4, 2026
 */

import { palette } from "@haruhimemoe/brand/palette";
import { type LlmsFullPart, llmsFull } from "@haruhimemoe/next-kit/seo";
import { BRAND_COLORS } from "@/constants/brand";
import { type ChangelogSource, changelogUrls } from "@/constants/changelogs";
import { DISCLAIMER_UPDATED, PRIVACY_UPDATED, TERMS_UPDATED } from "@/constants/legal";
import { LIBRARIES, type Library, libraryUrls } from "@/constants/libraries";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { type Changelog, sectionMarkdown } from "@/utils/changelog";
import type { ChangelogResult } from "@/utils/changelog-feed";
import { formatIsoDate } from "@/utils/date";

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

/** The tools with their own terms and privacy pages, as /terms and /privacy link them. */
const LIVE_TOOLS = TOOLS.filter((tool) => tool.url);

/**
 * @function disclaimerPart
 * @returns {LlmsFullPart} /disclaimer's sections verbatim, as Markdown
 */
const disclaimerPart = (): LlmsFullPart => {
  const markdown = [
    `Last updated ${formatIsoDate(DISCLAIMER_UPDATED)}.`,
    "",
    "## Not affiliated",
    "",
    "haruhime.moe and its tools are not affiliated with or endorsed by ppy Pty Ltd. osu! is a " +
      "trademark of ppy Pty Ltd.",
    "",
    "## The osu! API and the hinai mirror",
    "",
    "The tools use the osu! API and the hinai beatmap mirror (mirror.hinamizawa.ai), under each " +
      "one's terms. Neither is run by me.",
    "",
    "## Beatmaps belong to their creators",
    "",
    "Beatmaps belong to their mappers, and the music and art in them to their artists. The tools " +
      "point to beatmaps; they don't host them or claim them.",
    "",
    "## Provided as is",
    "",
    `Everything here is provided as is, without warranty of any kind. Use it at your own risk. ` +
      `Questions go to ${SITE.contactEmail}.`,
    "",
    "## Made with AI help",
    "",
    "AI coding tools (Claude, Claude Code by Anthropic) were used during the making of this site " +
      "and its child tooling.",
  ].join("\n");
  return { title: "Disclaimer", url: `${SITE.url}/disclaimer`, markdown };
};

/**
 * @function termsPart
 * @returns {LlmsFullPart} /terms's sections verbatim, as Markdown
 */
const termsPart = (): LlmsFullPart => {
  const toolLinks = LIVE_TOOLS.map(
    (tool) => `- [${tool.name} terms](${tool.url}/legal/terms)`,
  ).join("\n");
  const markdown = [
    `Last updated ${formatIsoDate(TERMS_UPDATED)}.`,
    "",
    "## What this site is",
    "",
    `${SITE.name} is the home page for haruhime's osu! tools: it describes them, links to them, ` +
      `lists the libraries they're built from and shows their README files. It has no accounts ` +
      `and stores nothing you type. Using the site means you accept these terms.`,
    "",
    "## The libraries",
    "",
    `The @haruhimemoe packages shown on [Libraries](${SITE.url}/libraries) are released under ` +
      `the MIT license. Each package's license file governs its use; the docs pages here are a ` +
      `rendering of each repo's README and may lag the repo.`,
    "",
    "## Each tool has its own terms",
    "",
    "The tools run on their own subdomains with their own accounts and data, so each has its own " +
      "terms, which apply there instead of these:",
    "",
    toolLinks,
    "",
    "## No warranty",
    "",
    "The site and everything it links to are provided as is, without warranty of any kind. " +
      "haruhime isn't liable for any loss that comes from using them. The site isn't affiliated " +
      "with or endorsed by ppy Pty Ltd.",
    "",
    "## Changes",
    "",
    "These terms can change. The date at the top is the last time they did, and the current " +
      "version is always at this address.",
    "",
    "## Contact",
    "",
    `Questions about these terms go to [${SITE.contactEmail}](mailto:${SITE.contactEmail}).`,
  ].join("\n");
  return { title: "Terms", url: `${SITE.url}/terms`, markdown };
};

/**
 * @function privacyPart
 * @returns {LlmsFullPart} /privacy's sections verbatim, as Markdown
 */
const privacyPart = (): LlmsFullPart => {
  const toolLinks = LIVE_TOOLS.map(
    (tool) => `- [${tool.name} privacy policy](${tool.url}/legal/privacy)`,
  ).join("\n");
  const markdown = [
    `Last updated ${formatIsoDate(PRIVACY_UPDATED)}.`,
    "",
    "## What this site collects",
    "",
    `Nothing of its own. ${SITE.name} has no accounts, sets no cookies, runs no analytics and ` +
      `has no forms. Every page is static. Nothing you do here is tied to you or shared with ` +
      `anyone.`,
    "",
    "## Our host",
    "",
    "The site is served by Vercel, which keeps standard request logs (such as your IP address, " +
      "browser type and the page requested) for security and operations, under " +
      "[Vercel's privacy policy](https://vercel.com/legal/privacy-policy). We don't read them.",
    "",
    "## Library stats",
    "",
    `The numbers on [Libraries](${SITE.url}/libraries) (versions, downloads, stars, releases) ` +
      `and each README come from npm and GitHub. Our server fetches them about once a day and ` +
      `keeps a copy; your browser never contacts npm or GitHub for them, so neither sees your ` +
      `visit.`,
    "",
    "## Each tool has its own policy",
    "",
    "The tools run on their own subdomains, and the ones with accounts store data there. Each " +
      "has its own privacy policy, which applies there instead of this one:",
    "",
    toolLinks,
    "",
    "## Contact",
    "",
    `Questions about privacy go to [${SITE.contactEmail}](mailto:${SITE.contactEmail}).`,
  ].join("\n");
  return { title: "Privacy", url: `${SITE.url}/privacy`, markdown };
};

/**
 * @function buildLlmsFull
 * @param changelogs {readonly ChangelogResult[]} every fetched repo (default none)
 * @returns {string} the llms-full.txt body: the brand page, every library's docs page, each
 *   loaded repo's changelog, then the three legal pages, each as its own document (llmsFull),
 *   ending with a trailing newline
 */
export const buildLlmsFull = (changelogs: readonly ChangelogResult[] = []): string => {
  const parts: LlmsFullPart[] = [
    brandPart(),
    ...LIBRARIES.map(libraryPart),
    ...changelogs.flatMap((result) =>
      "changelog" in result ? [changelogPart(result.source, result.changelog)] : [],
    ),
    disclaimerPart(),
    termsPart(),
    privacyPart(),
  ];
  return llmsFull(parts, {
    title: `${SITE.name}: brand, libraries, changelogs and legal`,
    summary: SITE.description,
  });
};
