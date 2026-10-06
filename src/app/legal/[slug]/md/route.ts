/**
 * @file src/app/legal/[slug]/md/route.ts
 * @desc The Markdown mirror of a legal page, served at /legal/<slug>.md (next.config.ts
 *       rewrites it here) for AI assistants (llms.txt links it) and "Copy as Markdown". Static;
 *       unregistered slugs never build and answer 404.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { contentParams } from "@haruhimemoe/next-kit/docs";
import { readContentMarkdown } from "@haruhimemoe/next-kit/docs/files";
import { textResponse } from "@haruhimemoe/next-kit/seo";
import { CONTENT } from "@/constants/content";
import { CONTENT_MARKDOWN_LEGAL } from "@/utils/content-markdown";

export const dynamic = "force-static";
export const dynamicParams = false;

export const generateStaticParams = () => contentParams(CONTENT, "legal");

export async function GET(_request: Request, { params }: RouteContext<"/legal/[slug]/md">) {
  const { slug } = await params;
  const md = await readContentMarkdown(CONTENT, "legal", slug, CONTENT_MARKDOWN_LEGAL);
  // An explicit 404: notFound() in a route handler misbehaves on Next 16.
  if (md === null) return new Response("Not found.\n", { status: 404 });
  return textResponse(md, { type: "text/markdown" });
}
