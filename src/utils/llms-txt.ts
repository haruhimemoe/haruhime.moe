/**
 * @file src/utils/llms-txt.ts
 * @desc Builds /llms.txt (llmstxt.org): a summary, the tools, every page, and links elsewhere.
 *       Built from SITE, TOOLS and PAGE_PATHS so a new page or tool shows up on its own. Pure
 *       so the route handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { PAGE_PATHS, SITE } from "@/constants/site";
import { TOOLS, type Tool } from "@/constants/tools";

/** Short description for each page in PAGE_PATHS, for the Pages section. */
const PAGE_DESCRIPTIONS: Record<(typeof PAGE_PATHS)[number], string> = {
  "/": "Homepage: the tools, the Evergreen Cup card, and a short hello.",
  "/thanks": "The people and projects the haruhime.moe tools are built on.",
  "/brand": "The haruhime.moe name, logos, colors, and the packs/pools/sheets icons.",
  "/contact": "How to reach haruhime: email, GitHub, and security reports.",
  "/disclaimer": "No ppy affiliation, third-party terms, and the as-is notice.",
};

/**
 * @function toolLine
 * @param tool {Tool} a tool from TOOLS
 * @returns {string} a live tool as a link with its tagline (packs also points at its own
 *   llms.txt); a tool without a url as plain text marked "coming soon", never a dead link
 */
export const toolLine = (tool: Tool): string => {
  if (!tool.url) {
    return `- ${tool.name}: ${tool.tagline} (coming soon)`;
  }
  const seeAlso = tool.name === "packs" ? ` See also its own llms.txt: ${tool.url}/llms.txt` : "";
  return `- [${tool.name}](${tool.url}): ${tool.tagline}.${seeAlso}`;
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
      (path) => `- [${SITE.url}${path}](${SITE.url}${path}): ${PAGE_DESCRIPTIONS[path]}`,
    ),
    "",
    "## Elsewhere",
    `- [GitHub](${SITE.githubOrg}): source and issues for every tool`,
    `- [Claude Code plugin](${SITE.githubOrg}/claude-plugin): haruhime's Claude Code plugin`,
    "- [npm](https://www.npmjs.com/org/haruhimemoe): the @haruhimemoe packages",
    "",
  ];
  return lines.join("\n");
};
