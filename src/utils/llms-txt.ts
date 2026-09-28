/**
 * @file src/utils/llms-txt.ts
 * @desc Builds /llms.txt (llmstxt.org): a summary, the tools, every page, and links elsewhere.
 *       Built from SITE, TOOLS and PAGES so a new page or tool shows up on its own. Pure
 *       so the route handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { PAGE_PATHS, PAGES, SITE } from "@/constants/site";
import { TOOLS, type Tool } from "@/constants/tools";

/**
 * @function toolLine
 * @param tool {Tool} a tool from TOOLS
 * @returns {string} a live tool as a link with its tagline, then "In beta." for a beta tool, what
 *   it does, and its own llms.txt when it serves one; a tool without a url as plain text marked
 *   "coming soon", never a dead link
 */
export const toolLine = (tool: Tool): string => {
  if (!tool.url) {
    return `- ${tool.name}: ${tool.tagline} (coming soon)`;
  }
  const beta = tool.beta ? " In beta." : "";
  const about = tool.about ? ` ${tool.about}` : "";
  const seeAlso = tool.llmsTxt ? ` See also its own llms.txt: ${tool.url}/llms.txt` : "";
  return `- [${tool.name}](${tool.url}): ${tool.tagline}.${beta}${about}${seeAlso}`;
};

/**
 * @function buildLlmsTxt
 * @returns {string} the llms.txt body (llmstxt.org format), ending with a trailing newline
 */
export const buildLlmsTxt = (): string => {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "## Tools",
    ...TOOLS.map(toolLine),
    "",
    "## Pages",
    ...PAGE_PATHS.map(
      (path) => `- [${PAGES[path].title}](${SITE.url}${path}): ${PAGES[path].description}`,
    ),
    "",
    "## Elsewhere",
    `- [GitHub](${SITE.githubOrg}): source and issues for every tool`,
    `- [Claude Code plugin](${SITE.githubOrg}/claude-plugin): haruhime's Claude Code plugin`,
    "- [npm](https://www.npmjs.com/org/haruhimemoe): the @haruhimemoe packages",
    `- [Discord](${SITE.discordUrl}): questions and feedback about the tools`,
    "",
  ];
  return lines.join("\n");
};
