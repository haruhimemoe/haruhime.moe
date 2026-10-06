/**
 * @file src/utils/readme.ts
 * @desc Pure transforms a README gets before /libraries/<name> renders it: the leading banner
 *       paragraph and the `# title` line go (the page has its own header), and relative links and images point at
 *       GitHub (the file's blob page for links, the raw file for images) so they still resolve
 *       off the repo. Absolute URLs, anchors and mailto links stay as they are. Also the
 *       README's table of contents for the page's Toc, with the ids ui's remark plugin gives the
 *       same headings.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Tue Oct 6, 2026
 */

import { createSlugger, type TocItem } from "@haruhimemoe/ui/remark";

/** A README that opens with a centered paragraph (our banner), through its closing tag. */
const LEADING_BANNER = /^\s*<p align="center">[\s\S]*?<\/p>\s*/;

/** The README's own title: a first-line `# heading` (after the banner) and the blank lines after. */
const LEADING_TITLE = /^#\s[^\n]*\n\s*/;

/** A Markdown link or image: `[text](target "title")`, with the `!` for images. */
const LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g;

/** Targets that already resolve: a scheme, an anchor, a protocol-relative URL. */
const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;

/** An ATX heading of depth 2 to 4: its hashes and its text, minus any closing hashes. */
const HEADING = /^(#{2,4})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/;

/** A fenced code block's opening or closing line. */
const FENCE = /^ {0,3}(`{3,}|~{3,})/;

/**
 * @function headingText
 * @param markdown {string} a heading's inline Markdown
 * @param tags {boolean} keep raw HTML tags, the way remark's text content does (true for the
 *   slug), or drop them (false for the text a reader sees)
 * @returns {string} its plain text: code spans and backslash escapes kept as written, images
 *   dropped, links reduced to their text, emphasis marks (`*`, and `_` outside words) removed
 */
const headingText = (markdown: string, tags: boolean): string => {
  const kept: string[] = [];
  const keep = (value: string) => `\u{E000}${kept.push(value) - 1}\u{E001}`;
  const text = markdown
    .replace(/(`+)(.+?)\1/g, (_, __, span: string) => keep(span.trim()))
    .replace(/\\([!-/:-@[-`{-~])/g, (_, char: string) => keep(char))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, (tag) => (tags ? tag : ""))
    .replace(/(\*{1,3})(\S(?:.*?\S)?)\1/g, "$2")
    .replace(/(^|\W)(_{1,3})(\S(?:.*?\S)?)\2(?!\w)/g, "$1$3");
  return text.replace(/\u{E000}(\d+)\u{E001}/gu, (_, i: string) => kept[Number(i)] ?? "").trim();
};

/**
 * @function readmeToc
 * @param markdown {string} a README ready to render (prepareReadme's output)
 * @returns {TocItem[]} its h2 to h4 headings in order, outside code fences, each with the id
 *   ui's remark plugin gives it (GitHub-style slugs, repeats suffixed -1, -2)
 */
export const readmeToc = (markdown: string): TocItem[] => {
  const slug = createSlugger();
  const toc: TocItem[] = [];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    const marker = FENCE.exec(line)?.[1];
    if (fence) {
      if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      continue;
    }
    if (marker) {
      fence = marker;
      continue;
    }
    const heading = HEADING.exec(line);
    if (!heading) continue;
    const id = slug(headingText(heading[2] as string, true));
    const text = headingText(heading[2] as string, false).replace(/\s+/g, " ");
    if (id) toc.push({ id, text, depth: (heading[1] as string).length as TocItem["depth"] });
  }
  return toc;
};

/**
 * @function stripBanner
 * @param markdown {string} a README
 * @returns {string} the README without a leading `<p align="center">…</p>` block
 */
export const stripBanner = (markdown: string): string => markdown.replace(LEADING_BANNER, "");

/**
 * @function stripTitle
 * @param markdown {string} a README without its banner
 * @returns {string} the README without a leading `# title` line: the page's own h1 names the
 *   package, and a second h1 would duplicate it
 */
export const stripTitle = (markdown: string): string => markdown.replace(LEADING_TITLE, "");

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
 * @returns {string} the README ready to render: banner and title stripped, relative URLs
 *   rewritten
 */
export const prepareReadme = (markdown: string, repo: string): string =>
  rewriteRelativeUrls(stripTitle(stripBanner(markdown)), repo);
