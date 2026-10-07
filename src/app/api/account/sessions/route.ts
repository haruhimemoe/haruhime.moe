/**
 * @file src/app/api/account/sessions/route.ts
 * @desc DELETE: "Sign out everywhere else". Ends every session of the signed-in user but the one
 *       making the request, on every haruhime app at once. A visitor gets 401; requests from other
 *       sites are refused. 200 with `{ revoked }`, the number signed out. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { jsonError, noStore } from "@haruhimemoe/next-kit/server";
import { refuseCrossSite } from "@/lib/api";
import { getUserFromHeaders } from "@/lib/auth";
import { revokeOtherSessions } from "@/lib/sessions";

/**
 * @function DELETE
 * @param request {Request} the incoming request
 * @returns {Promise<Response>} 200 with how many sessions ended, or a refusal
 */
export async function DELETE(request: Request) {
  const user = await getUserFromHeaders(request.headers);
  if (!user) return noStore(jsonError(401, "Sign in first."));
  const crossSite = refuseCrossSite(request);
  if (crossSite) return noStore(crossSite);
  const revoked = await revokeOtherSessions(user.id, user.sessionId);
  return noStore(Response.json({ revoked }));
}
