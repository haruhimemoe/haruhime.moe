/**
 * @file src/utils/llms-txt.ts
 * @desc Builds /llms.txt (llmstxt.org) with @haruhimemoe/next-kit/seo's llmsTxt: a summary, notes
 *       on what the site is and which tools haven't launched, then the live tools, every page,
 *       every repo's changelog page, and links elsewhere. Built from SITE, TOOLS, PAGES and
 *       CHANGELOG_SOURCES so a new page, tool or repo shows up on its own. Pure so the route
 *       handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { type LlmsLink, llmsTxt } from "@haruhimemoe/next-kit/seo";
import { CHANGELOG_SOURCES, changelogUrls } from "@/constants/changelogs";
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
 * @function buildLlmsTxt
 * @returns {string} the llms.txt body (llmstxt.org format), ending with a trailing newline
 */
export const buildLlmsTxt = (): string => {
  return llmsTxt({
    title: SITE.name,
    summary: SITE.description,
    notes: [
      `${SITE.name} is the home page of haruhime's osu! tools. Each tool lives on its own subdomain and is free to use. ${SITE.trademarkNotice}`,
      comingSoonNote(),
    ],
    sections: [
      { heading: "Tools", links: TOOLS.filter((tool) => tool.url).map(toolLink) },
      {
        heading: "Pages",
        links: PAGE_PATHS.map((path) => ({
          title: PAGES[path].title,
          url: `${SITE.url}${path}`,
          note: PAGES[path].description,
        })),
      },
      {
        heading: "Changelogs",
        links: CHANGELOG_SOURCES.map((source) => ({
          title: `${source.label} changelog`,
          url: `${SITE.url}${changelogUrls(source).page}`,
          note: `every ${source.label} release, newest first`,
        })),
      },
      {
        heading: "Elsewhere",
        links: [
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
          {
            title: "Discord",
            url: SITE.discordUrl,
            note: "questions and feedback about the tools",
          },
        ],
      },
    ],
  });
};
