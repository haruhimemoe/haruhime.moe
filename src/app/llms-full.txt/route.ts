/**
 * @file src/app/llms-full.txt/route.ts
 * @desc GET /llms-full.txt (llmstxt.org): the brand page, every library's docs page and the three
 *       legal pages, each in full as Markdown. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sat Oct 3, 2026
 * @modified Sat Oct 3, 2026
 */

import { textResponse } from "@haruhimemoe/next-kit/seo";
import { buildLlmsFull } from "@/utils/llms-full";

export const dynamic = "force-static";

export function GET(): Response {
  return textResponse(buildLlmsFull(), { maxAge: 3600, sMaxAge: 86400 });
}
