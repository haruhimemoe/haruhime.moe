/**
 * @file src/utils/llms-txt.ts
 * @desc Builds /llms.txt (llmstxt.org): a summary, the tools, every page, and links elsewhere.
 *       Built from SITE, TOOLS and PAGE_PATHS so a new page or tool shows up on its own. Pure
 *       so the route handler and its tests share one source.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Thu Sep 24, 2026
 */

import { PAGE_PATHS, SITE } from "@/constants/site";
import { TOOLS, type Tool } from "@/constants/tools";

/** Link title and short description for each page in PAGE_PATHS, for the Pages section. */
const PAGES: Record<(typeof PAGE_PATHS)[number], { title: string; description: string }> = {
  "/": { title: "Home", description: "The tools, the Evergreen Cup banner, and a short hello." },
  "/thanks": {
    title: "Thanks",
    description: "The people and projects the haruhime.moe tools are built on.",
  },
  "/brand": {
    title: "Brand",
    description: "The haruhime.moe name, logos, colors, and the packs/pools/sheets icons.",
  },
  "/ui": {
    title: "UI",
    description: "Every @haruhimemoe/ui component (the shared React kit), in its states.",
  },
  "/contact": {
    title: "Contact",
    description: "How to reach haruhime: email, GitHub, and security reports.",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description: "No ppy affiliation, third-party terms, and the as-is notice.",
  },
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
      (path) => `- [${PAGES[path].title}](${SITE.url}${path}): ${PAGES[path].description}`,
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
