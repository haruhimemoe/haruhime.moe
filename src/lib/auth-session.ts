/**
 * @file src/lib/auth-session.ts
 * @desc Session helpers for server pages (they read next/headers). Route handlers use
 *       getUserFromHeaders(request.headers) instead. Public pages never call these, so they stay
 *       static. A page for signed-in people sends a visitor to sign in and back.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { signInHref } from "@haruhimemoe/next-kit/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromHeaders, type HubUser } from "@/lib/auth";

/**
 * @function getCurrentUser
 * @returns {Promise<HubUser | null>} the signed-in user for this request, or null
 */
export const getCurrentUser = async (): Promise<HubUser | null> =>
  getUserFromHeaders(await headers());

/**
 * @function requireUser
 * @param next {string} where sign-in should return to (the page asking)
 * @returns {Promise<HubUser>} the user; redirects to /signin?next= when there is none
 */
export const requireUser = async (next: string): Promise<HubUser> => {
  const user = await getCurrentUser();
  if (!user) redirect(signInHref(next));
  return user;
};
