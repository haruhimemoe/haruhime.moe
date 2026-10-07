/**
 * @file src/app/api/auth/[...all]/route.ts
 * @desc better-auth handler: osu! sign-in, the OAuth callback (/api/auth/callback/osu), session
 *       and sign-out under /api/auth/*. Connects first, so identity's indexes exist before
 *       better-auth writes a row.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { connectDb } from "@/lib/db";

export const { GET, POST } = toNextJsHandler(async (request) => {
  await connectDb();
  return getAuth().handler(request);
});
