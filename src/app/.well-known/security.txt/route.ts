/**
 * @file src/app/.well-known/security.txt/route.ts
 * @desc GET /.well-known/security.txt (RFC 9116): where to report a vulnerability. Static:
 *       rendered once at build, with the Expires date pinned in src/constants/legal.ts.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { buildSecurityTxt } from "@/utils/security-txt";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildSecurityTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
