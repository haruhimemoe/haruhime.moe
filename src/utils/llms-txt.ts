/**
 * @file src/utils/llms-txt.ts
 * @desc Builds /llms.txt (llmstxt.org) with @haruhimemoe/next-kit/docs's contentLlmsTxt: a summary,
 *       notes on what the site is and which tools haven't launched, the live tools, every page,
 *       every repo's changelog page and links elsewhere (as link-line notes, since the sections
 *       are the registry's), then Legal from the content registry. haruhime.moe has no Docs,
 *       Guides or API. Built from SITE, TOOLS, PAGES, CHANGELOG_SOURCES and CONTENT so a new
 *       page, tool, repo or legal page shows up on its own. Pure so the route handler and its
 *       tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { contentLlmsTxt } from "@haruhimemoe/next-kit/docs";
import type { LlmsLink } from "@haruhimemoe/next-kit/seo";
import { CHANGELOG_SOURCES, changelogUrls } from "@/constants/changelogs";
import { CONTENT } from "@/constants/content";
import { SEO_SITE } from "@/constants/seo";
import { PAGE_PATHS, PAGES, SITE } from "@/constants/site";
import { TOOLS, type Tool } from "@/constants/tools";

/**
 * @function toolLink
 * @param tool {Tool} a live tool from TOOLS (one with a url)
 * @returns {LlmsLink} the tool as a link, its note the tagline, then "In beta." for a beta tool,
 *   what it does, and its own llms.txt when it serves one
 * @throws {Error} when the tool has no url: a tool that hasn't launched is never linked
 */
export const toolLink = (tool: Tool): LlmsLink => {
  if (!tool.url) throw new Error(`llms.txt: ${tool.name} hasn't launched, so it has no link`);
  const beta = tool.beta ? " In beta." : "";
  const about = tool.about ? ` ${tool.about}` : "";
  const seeAlso = tool.llmsTxt ? ` See also its own llms.txt: ${tool.url}/llms.txt` : "";
  return { title: tool.name, url: tool.url, note: `${tool.tagline}.${beta}${about}${seeAlso}` };
};

/**
 * @function comingSoonNote
 * @param tools {readonly Tool[]} the tools to look through (default TOOLS)
 * @returns {string} one sentence naming the tools without a url as coming soon, or "" when every
 *   tool is live (llmsTxt drops a blank note)
 */
export const comingSoonNote = (tools: readonly Tool[] = TOOLS): string => {
  const soon = tools.filter((tool) => !tool.url).map((tool) => `${tool.name} (${tool.tagline})`);
  return soon.length ? `Coming soon, not live yet: ${soon.join(", ")}.` : "";
};

/**
 * @function linkGroup
 * @param label {string} the group's label, like "Tools"
 * @param links {readonly LlmsLink[]} its links
 * @returns {string[]} notes: the label line, then one "- [title](url): note" line per link (each
 *   its own paragraph, since llmsTxt keeps a note on one line); none when there are no links
 */
export const linkGroup = (label: string, links: readonly LlmsLink[]): string[] =>
  links.length
    ? [
        `${label}:`,
        ...links.map(
          (link) => `- [${link.title}](${link.url})${link.note ? `: ${link.note}` : ""}`,
        ),
      ]
    : [];

/**
 * @function buildLlmsTxt
 * @returns {string} the llms.txt body (llmstxt.org format, through next-kit's contentLlmsTxt),
 *   ending with a trailing newline: the notes (what the site is, what's coming, then the Tools,
 *   Pages, Changelogs and Elsewhere links), then the Legal section from the content registry,
 *   each page linking its .md mirror. No Docs, Guides or API: haruhime.moe has none.
 */
export const buildLlmsTxt = (): string =>
  contentLlmsTxt({
    site: SEO_SITE,
    title: SITE.name,
    summary: SITE.description,
    notes: [
      `${SITE.name} is the home page of haruhime's osu! tools. Each tool lives on its own subdomain and is free to use. ${SITE.trademarkNotice}`,
      comingSoonNote(),
      ...linkGroup("Tools", TOOLS.filter((tool) => tool.url).map(toolLink)),
      ...linkGroup(
        "Pages",
        PAGE_PATHS.map((path) => ({
          title: PAGES[path].title,
          url: `${SITE.url}${path}`,
          note: PAGES[path].description,
        })),
      ),
      ...linkGroup(
        "Changelogs",
        CHANGELOG_SOURCES.map((source) => ({
          title: `${source.label} changelog`,
          url: `${SITE.url}${changelogUrls(source).page}`,
          note: `every ${source.label} release, newest first`,
        })),
      ),
      ...linkGroup("Elsewhere", [
        { title: "GitHub", url: SITE.githubOrg, note: "source and issues for every tool" },
        {
          title: "Claude Code plugin",
          url: `${SITE.githubOrg}/claude-plugin`,
          note: "haruhime's Claude Code plugin",
        },
        {
          title: "npm",
          url: "https://www.npmjs.com/org/haruhimemoe",
          note: "the @haruhimemoe packages",
        },
        { title: "Discord", url: SITE.discordUrl, note: "questions and feedback about the tools" },
      ]),
    ],
    content: CONTENT,
  });
