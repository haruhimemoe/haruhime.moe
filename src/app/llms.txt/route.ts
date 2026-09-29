/**
 * @file src/app/llms.txt/route.ts
 * @desc GET /llms.txt (llmstxt.org): a short guide to the site for LLMs. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { textResponse } from "@haruhimemoe/next-kit/seo";
import { buildLlmsTxt } from "@/utils/llms-txt";

export const dynamic = "force-static";

export function GET(): Response {
  return textResponse(buildLlmsTxt(), { maxAge: 3600, sMaxAge: 86400 });
}
