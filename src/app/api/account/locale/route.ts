/**
 * @file src/app/api/account/locale/route.ts
 * @desc PATCH: saves the signed-in user's language on identity.user.locale, checked against
 *       HUB_LOCALES (next-kit/i18n's hasLocale). negotiateLocale prefers it over Accept-Language.
 *       Body `{ locale }`. 204. Never cached.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { hasLocale } from "@haruhimemoe/next-kit/i18n";
import { jsonError, noStore, parseJsonBody } from "@haruhimemoe/next-kit/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { HUB_LOCALES } from "@/constants/accounts";
import { refuseCrossSite } from "@/lib/api";
import { getUserFromHeaders } from "@/lib/auth";
import { getIdentityDb } from "@/lib/db";

const bodySchema = z.strictObject({
  locale: z.string().refine((value) => hasLocale(HUB_LOCALES, value)),
});

export async function PATCH(request: Request) {
  const user = await getUserFromHeaders(request.headers);
  if (!user) return noStore(jsonError(401, "Sign in first."));
  const crossSite = refuseCrossSite(request);
  if (crossSite) return noStore(crossSite);
  const body = await parseJsonBody(request, bodySchema);
  if (!body.ok) return noStore(body.response);
  await getIdentityDb()
    .collection("user")
    .updateOne({ _id: new ObjectId(user.id) }, { $set: { locale: body.data.locale } });
  return noStore(new Response(null, { status: 204 }));
}
