/**
 * @file src/utils/readme.ts
 * @desc Pure transforms a README gets before /libraries/<name> renders it: the leading banner
 *       paragraph goes (the page has its own header), and relative links and images point at
 *       GitHub (the file's blob page for links, the raw file for images) so they still resolve
 *       off the repo. Absolute URLs, anchors and mailto links stay as they are.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

/** A README that opens with a centered paragraph (our banner), through its closing tag. */
const LEADING_BANNER = /^\s*<p align="center">[\s\S]*?<\/p>\s*/;

/** A Markdown link or image: `[text](target "title")`, with the `!` for images. */
const LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g;

/** Targets that already resolve: a scheme, an anchor, a protocol-relative URL. */
const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;

/**
 * @function stripBanner
 * @param markdown {string} a README
 * @returns {string} the README without a leading `<p align="center">…</p>` block
 */
export const stripBanner = (markdown: string): string => markdown.replace(LEADING_BANNER, "");

/**
 * @function rewriteRelativeUrls
 * @param markdown {string} a README
 * @param repo {string} the repo name under haruhimemoe
 * @returns {string} the README with each relative link pointing at the file's page on GitHub
 *   and each relative image at the raw file, both on main
 */
export const rewriteRelativeUrls = (markdown: string, repo: string): string =>
  markdown.replace(LINK, (match, bang: string, text: string, target: string, title: string) => {
    if (ABSOLUTE.test(target)) return match;
    const path = target.replace(/^\.\//, "");
    const base = bang
      ? `https://raw.githubusercontent.com/haruhimemoe/${repo}/main/`
      : `https://github.com/haruhimemoe/${repo}/blob/main/`;
    return `${bang}[${text}](${base}${path}${title})`;
  });

/**
 * @function prepareReadme
 * @param markdown {string} a README as fetched
 * @param repo {string} the repo name under haruhimemoe
 * @returns {string} the README ready to render: banner stripped, relative URLs rewritten
 */
export const prepareReadme = (markdown: string, repo: string): string =>
  rewriteRelativeUrls(stripBanner(markdown), repo);
