/**
 * @file src/app/api/account/sessions/[id]/route.ts
 * @desc DELETE: signs one of the signed-in user's other sessions out, by its id (tokens never
 *       reach the browser). The current session signs out through better-auth's sign-out
 *       instead, so it's refused here. A visitor gets 401; requests from other sites are refused;
 *       a session that isn't theirs (or is already gone) is 404. 204 otherwise. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { jsonError, noStore } from "@haruhimemoe/next-kit/server";
import { refuseCrossSite } from "@/lib/api";
import { getUserFromHeaders } from "@/lib/auth";
import { revokeSession } from "@/lib/sessions";

/**
 * @function DELETE
 * @param request {Request} the incoming request
 * @param context {RouteContext<"/api/account/sessions/[id]">} the session's id
 * @returns {Promise<Response>} 204 once it's signed out, or a refusal
 */
export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/account/sessions/[id]">,
) {
  const user = await getUserFromHeaders(request.headers);
  if (!user) return noStore(jsonError(401, "Sign in first."));
  const crossSite = refuseCrossSite(request);
  if (crossSite) return noStore(crossSite);
  const { id } = await params;
  if (id === user.sessionId) {
    return noStore(jsonError(400, "Use Sign out to end this session."));
  }
  if (!(await revokeSession(user.id, id))) {
    return noStore(jsonError(404, "That session is already gone."));
  }
  return noStore(new Response(null, { status: 204 }));
}
