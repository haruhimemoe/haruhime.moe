/**
 * @file src/utils/content-markdown.ts
 * @desc The one `{ siteUrl, transforms }` value every `readContentMarkdown` call passes: the
 *       site's origin for root-relative links and images, and ui's `mdxMarkdownTransforms` so a
 *       `.md` mirror turns `<Figure>`, `<Embed>` and `<MdxLinkCard>` into plain Markdown instead
 *       of dropping them. One constant, one unit test, shared by `/legal/[slug]/md` and
 *       `/llms-full.txt`. `CONTENT_MARKDOWN_LEGAL` runs next-kit's `legalMarkdownTransform` first,
       so the legal blocks (`<YourRights />` and the rest) print their clauses in the mirrors
       instead of vanishing.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { legalMarkdownTransform } from "@haruhimemoe/next-kit/legal";
import { mdxMarkdownTransforms } from "@haruhimemoe/ui/remark";
import { LEGAL_SITE } from "@/constants/legal-site";
import { SITE } from "@/constants/site";

/** `readContentMarkdown`'s options, shared across every section. */
export const CONTENT_MARKDOWN = { siteUrl: SITE.url, transforms: mdxMarkdownTransforms } as const;

/** `CONTENT_MARKDOWN`, plus `legalMarkdownTransform` run first: for the legal section only. */
export const CONTENT_MARKDOWN_LEGAL = {
  siteUrl: SITE.url,
  transforms: [legalMarkdownTransform(LEGAL_SITE), ...mdxMarkdownTransforms],
} as const;
