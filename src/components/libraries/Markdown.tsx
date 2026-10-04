/**
 * @file src/components/libraries/Markdown.tsx
 * @desc A README rendered inside Prose: GitHub-flavored Markdown (tables, task lists, strike),
 *       ui's shared MDX components (heading anchors on h2/h3, highlighted code blocks,
 *       GitHub-style callouts, external links in a new tab, a focusable named table wrapper),
 *       and the README's own HTML parsed then sanitized. The sanitizer is GitHub's default
 *       schema plus the attributes ui's remark plugin and components read and write (heading
 *       ids, a code block's language class and fence meta, a callout blockquote's marker) and
 *       the picture and source tags our banners use.
 *       Our own READMEs are the only input, so this is defense in depth, not the trust boundary.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sat Oct 3, 2026
 */

import { mdxComponents } from "@haruhimemoe/ui/mdx";
import remarkHaruhime from "@haruhimemoe/ui/remark";
import "@haruhimemoe/ui/shiki";
import { Prose } from "@haruhimemoe/ui";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

/**
 * GitHub's schema, plus the attributes ui's remark plugin writes and `mdxComponents` reads back
 * (heading ids on h2/h3, a code block's language class and fence meta, a callout blockquote's
 * marker), and picture/source for banners.
 */
const SCHEMA = {
  ...defaultSchema,
  // Heading ids stay as the remark plugin wrote them; the default prefix would break every anchor.
  clobberPrefix: "",
  tagNames: [...(defaultSchema.tagNames ?? []), "picture", "source"],
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-/], "dataMeta"],
    blockquote: [...(defaultSchema.attributes?.blockquote ?? []), "dataCallout"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    source: ["srcSet", "media", "type"],
  },
};

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
        rehypePlugins={[rehypeRaw, [rehypeSanitize, SCHEMA]]}
        components={mdxComponents}
      >
        {source}
      </ReactMarkdown>
    </Prose>
  );
}
