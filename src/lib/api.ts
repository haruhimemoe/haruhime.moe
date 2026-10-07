/**
 * @file src/lib/api.ts
 * @desc What the hub's account routes share: refusing requests from other sites (a sibling
 *       *.haruhime.moe host included, since the session cookie reaches them), and the Set-Cookie
 *       that clears the signed-in marker on the same domain it was set on.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { refuseCrossSite as refuse } from "@haruhimemoe/next-kit/server";
import { SIGNED_IN_COOKIE } from "@/constants/accounts";
import { SITE } from "@/constants/site";
import { getHubCookieDomain } from "@/env";

/**
 * @function refuseCrossSite
 * @param request {Request} a cookie-authenticated mutation
 * @returns {Response | null} 403 when it came from another site or a sibling subdomain; else null
 */
export const refuseCrossSite = (request: Request): Response | null =>
  refuse(request, { siteUrl: SITE.url, siteTitle: SITE.name });

/**
 * @function clearMarkerCookie
 * @returns {string} a Set-Cookie value that expires the signed-in marker, on HUB_COOKIE_DOMAIN
 *          when it's set
 */
export const clearMarkerCookie = (): string => {
  const domain = getHubCookieDomain();
  return `${SIGNED_IN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
};
