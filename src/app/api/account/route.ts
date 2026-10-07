/**
 * @file src/app/api/account/route.ts
 * @desc DELETE: the signed-in user deletes their haruhime account (src/lib/sessions.ts): the
 *       identity user, their osu! link and every session, so they're signed out of every app. A
 *       visitor gets 401; then requests from other sites (a sibling *.haruhime.moe host included)
 *       are refused, and the body must be JSON: `{ username }`, the caller's osu! username as they
 *       typed it to confirm (trimmed, exact case), then at most 3 deletions an hour per osu!
 *       account (by osu! id: deleting, signing in again and deleting can't go round it). Each
 *       app's own data (packs, pools, bb) is deleted first through the account fan-out; the
 *       identity goes only when every app succeeded, else 502 naming the apps. 204, clearing the signed-in marker. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { jsonError, noStore, parseJsonBody } from "@haruhimemoe/next-kit/server";
import { z } from "zod";
import { RATE_LIMITS } from "@/constants/api";
import { deleteAccount } from "@/lib/account-data";
import { clearMarkerCookie, refuseCrossSite } from "@/lib/api";
import { getUserFromHeaders } from "@/lib/auth";
import { limitUser } from "@/lib/rate-limit";

const bodySchema = z.strictObject({ username: z.string().trim().max(64) });

const CONFIRM_MISMATCH = "Type your osu! username exactly as it's shown to confirm.";

/**
 * @function DELETE
 * @param request {Request} the incoming request
 * @returns {Promise<Response>} 204 once the account is gone, or a refusal
 */
export async function DELETE(request: Request) {
  const user = await getUserFromHeaders(request.headers);
  if (!user) return noStore(jsonError(401, "Sign in first."));
  const crossSite = refuseCrossSite(request);
  if (crossSite) return noStore(crossSite);
  const body = await parseJsonBody(request, bodySchema);
  if (!body.ok) return noStore(body.response);
  if (body.data.username !== user.username) {
    return noStore(jsonError(400, CONFIRM_MISMATCH, "confirm_mismatch"));
  }
  const limited = await limitUser(RATE_LIMITS.accountDelete, user);
  if (limited) return limited;
  const report = await deleteAccount(user);
  if (!report.ok) {
    const failed = report.results.filter((result) => !result.ok).map((result) => result.id);
    return noStore(
      jsonError(
        502,
        `Nothing was deleted: ${failed.join(", ")} couldn't delete your data. Try again later.`,
        "fan_out_failed",
      ),
    );
  }
  const response = noStore(new Response(null, { status: 204 }));
  response.headers.append("Set-Cookie", clearMarkerCookie());
  return response;
}
