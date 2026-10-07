/**
 * @file src/app/api/signin/osu/route.ts
 * @desc GET /api/signin/osu?next=: straight to osu!'s consent screen, no hub page in between.
 *       Satellites (packs, pools, bb) link here instead of /signin. `next` goes through
 *       resolveNext, the same check /signin runs (HUB_HOSTS, no loop back to a sign-in route).
 *       A visitor who is already signed in goes through /signin, which hands them on with the
 *       marker. Otherwise better-auth starts the osu! flow server-side (disableRedirect plus
 *       returnHeaders), and the 302 to osu! carries its state cookie. A failed sign-in lands on
 *       the hub's /signin with ?error=<code> and the same `next`, so the retry goes back to the
 *       satellite. Rate-limited per IP.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { OSU_PROVIDER_ID } from "@haruhimemoe/next-kit/auth";
import { clientIp, noStore, rateLimitSubject, signInHref } from "@haruhimemoe/next-kit/server";
import { DEFAULT_AFTER_SIGN_IN, HUB_HOSTS } from "@/constants/accounts";
import { RATE_LIMITS } from "@/constants/api";
import { getServerEnv } from "@/env";
import { getAuth, getUserFromHeaders } from "@/lib/auth";
import { limiter } from "@/lib/rate-limit";
import { resolveNext } from "@/utils/signin";

const redirect = (location: string, cookies: readonly string[] = []): Response => {
  const response = noStore(new Response(null, { status: 302, headers: { Location: location } }));
  for (const cookie of cookies) response.headers.append("Set-Cookie", cookie);
  return response;
};

export async function GET(request: Request) {
  const base = getServerEnv().BETTER_AUTH_URL;
  const params = new URL(request.url).searchParams;
  const next = resolveNext(params.getAll("next"), {
    hosts: HUB_HOSTS,
    fallback: DEFAULT_AFTER_SIGN_IN,
  });
  const signInPage = new URL(signInHref(next), base).toString();
  const limited = await limiter.refuseOverLimit(
    RATE_LIMITS.signIn,
    rateLimitSubject(clientIp(request.headers)),
  );
  if (limited) return noStore(limited);
  if (await getUserFromHeaders(request.headers)) return redirect(signInPage);
  try {
    const { headers, response } = await getAuth().api.signInSocial({
      body: {
        provider: OSU_PROVIDER_ID,
        callbackURL: next,
        errorCallbackURL: signInPage,
        disableRedirect: true,
      },
      headers: request.headers,
      returnHeaders: true,
    });
    if (!response.url) return redirect(signInPage);
    return redirect(response.url, headers.getSetCookie());
  } catch (error) {
    console.error("[signin] osu! sign-in did not start", error);
    return redirect(`${signInPage}&error=please_restart_the_process`);
  }
}
