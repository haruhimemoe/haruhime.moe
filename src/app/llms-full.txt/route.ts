/**
 * @file src/app/llms-full.txt/route.ts
 * @desc GET /llms-full.txt (llmstxt.org): the brand page, every library's docs page, each repo's
 *       newest changelog entries and the three legal pages, each in full as Markdown. Static,
 *       rebuilt once a day like the changelogs it carries.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sun Oct 4, 2026
 */

import { textResponse } from "@haruhimemoe/next-kit/seo";
import { fetchAllChangelogs } from "@/lib/changelogs";
import { buildLlmsFull } from "@/utils/llms-full";

export const dynamic = "force-static";

/** Once a day, like the changelogs it carries. */
export const revalidate = 86400;

export async function GET(): Promise<Response> {
  return textResponse(await buildLlmsFull(await fetchAllChangelogs()), {
    maxAge: 3600,
    sMaxAge: 86400,
  });
}
