/**
 * @file src/components/libraries/Markdown.tsx
 * @desc A README rendered inside Prose: GitHub-flavored Markdown (tables, task lists, strike),
 *       slug ids on headings so anchors work, and the README's own HTML parsed then sanitized.
 *       The sanitizer is GitHub's default schema plus the ids on headings and the picture and
 *       source tags our banners use.
 *       Our own READMEs are the only input, so this is defense in depth, not the trust boundary.
 *       External links open in a new tab. Code blocks are focusable, so a keyboard user can scroll
 *       a wide one.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sat Oct 3, 2026
 */

import { Prose } from "@haruhimemoe/ui";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/** GitHub's schema, plus heading ids (from rehype-slug) and picture/source for banners. */
const SCHEMA = {
  ...defaultSchema,
  // Heading ids stay as rehype-slug wrote them; the default prefix would break every anchor.
  clobberPrefix: "",
  tagNames: [...(defaultSchema.tagNames ?? []), "picture", "source"],
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
    source: ["srcSet", "media", "type"],
  },
};

const COMPONENTS: Components = {
  // A wide code block scrolls sideways; tabIndex lets the keyboard reach it (WCAG 2.1.1).
  pre: ({ node: _node, ...props }) => (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs keyboard focus
    <pre tabIndex={0} {...props} />
  ),
  a: ({ href, children, ...props }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {children}
      </a>
    );
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
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeSanitize, SCHEMA]]}
        components={COMPONENTS}
      >
        {source}
      </ReactMarkdown>
    </Prose>
  );
}
