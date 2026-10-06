/**
 * @file src/components/libraries/Markdown.tsx
 * @desc A README rendered inside Prose: GitHub-flavored Markdown (tables, task lists, strike),
 *       ui's shared MDX components (heading anchors on h2/h3/h4, highlighted code blocks,
 *       GitHub-style callouts, figures, video embeds, external links in a new tab, a focusable
 *       named table wrapper), and the README's own HTML parsed then sanitized. The sanitizer is
 *       `haruhimeSanitizeSchema`, GitHub's default schema plus the attributes ui's remark
 *       plugins and components read and write (heading ids, a code block's language class and
 *       fence meta, a callout blockquote's marker, figure/figcaption, an embed div), trusted
 *       (no `user-content-` id prefix) because our own READMEs are the only input, so this is
 *       defense in depth, not the trust boundary. Only heading ids and `user-content-` ids pass,
 *       every name is dropped, so raw HTML can't clobber a global.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Tue Oct 6, 2026
 */

import { Prose } from "@haruhimemoe/ui";
import { mdxComponents } from "@haruhimemoe/ui/mdx";
import remarkHaruhime, { haruhimeSanitizeSchema } from "@haruhimemoe/ui/remark";
import "@haruhimemoe/ui/shiki";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

/** Attributes an unprefixed id or name could use to clobber a global (`window.x`, `document.x`). */
const CLOBBERING = new Set(["id", "name"]);

/**
 * GitHub's schema plus what ui's plugins write. trusted (no prefix) so heading anchors match the
 * Toc, but elsewhere `name` is dropped and an `id` must already start with `user-content-` (the
 * footnote ids remark-gfm writes), so raw HTML in a README can't name a global.
 */
const TRUSTED = haruhimeSanitizeSchema(defaultSchema, { trusted: true });
const README_SCHEMA = {
  ...TRUSTED,
  attributes: Object.fromEntries(
    Object.entries(TRUSTED.attributes ?? {}).map(([tag, list]) => [
      tag,
      /^h[1-6]$/.test(tag)
        ? list
        : [
            ...list.filter((entry) => !CLOBBERING.has(Array.isArray(entry) ? entry[0] : entry)),
            ["id", /^user-content-/],
          ],
    ]),
  ),
};
for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
  const list = README_SCHEMA.attributes[tag] ?? [];
  if (!list.includes("id")) README_SCHEMA.attributes[tag] = [...list, "id"];
}

/**
 * @function Markdown
 * @param props {{ source: string }} the Markdown to render
 * @returns {JSX.Element} the rendered Markdown inside Prose
 */
export function Markdown({ source }: { source: string }) {
  return (
    <Prose>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHaruhime]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, README_SCHEMA]]}
        components={mdxComponents}
      >
        {source}
      </ReactMarkdown>
    </Prose>
  );
}
