/**
 * @file src/utils/content-markdown.ts
 * @desc The one `{ siteUrl, transforms }` value every `readContentMarkdown` call passes: the
 *       site's origin for root-relative links and images, and ui's `mdxMarkdownTransforms` so a
 *       `.md` mirror turns `<Figure>`, `<Embed>` and `<MdxLinkCard>` into plain Markdown instead
 *       of dropping them. One constant, one unit test, shared by `/legal/[slug]/md` and
 *       `/llms-full.txt`.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { mdxMarkdownTransforms } from "@haruhimemoe/ui/remark";
import { SITE } from "@/constants/site";

/** `readContentMarkdown`'s options, shared across every section. */
export const CONTENT_MARKDOWN = { siteUrl: SITE.url, transforms: mdxMarkdownTransforms } as const;
