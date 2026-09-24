/**
 * @file src/app/llms.txt/route.ts
 * @desc GET /llms.txt (llmstxt.org): a short guide to the site for LLMs. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { buildLlmsTxt } from "@/utils/llms-txt";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
