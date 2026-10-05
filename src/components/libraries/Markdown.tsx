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
 *       defense in depth, not the trust boundary.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sun Oct 4, 2026
 */

import { Prose } from "@haruhimemoe/ui";
import { mdxComponents } from "@haruhimemoe/ui/mdx";
import remarkHaruhime, { haruhimeSanitizeSchema } from "@haruhimemoe/ui/remark";
import "@haruhimemoe/ui/shiki";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

/** GitHub's schema plus what ui's plugins write. trusted: our own READMEs and changelogs only. */
const README_SCHEMA = haruhimeSanitizeSchema(defaultSchema, { trusted: true });

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
