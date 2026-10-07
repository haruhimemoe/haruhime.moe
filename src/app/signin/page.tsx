/**
 * @file src/app/signin/page.tsx
 * @desc /signin?next=: osu! sign-in for every haruhime app. This is the only place sign-in runs:
 *       packs, pools and bb send people here with a full `next` URL, which resolveNext checks
 *       against HUB_HOSTS (the hub's check is the authoritative one); a path stays on this site.
 *       A signed-in visitor goes on to `next` through the browser, so a session without the
 *       readable signed-in marker gets it on the way. Every failed sign-in comes back here with
 *       ?error=<code>, which the page explains in plain words. Never indexed; reads the session,
 *       so it renders per request.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { pageMetadata } from "@haruhimemoe/next-kit/seo";
import { PageHeader, Text, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { DEFAULT_AFTER_SIGN_IN, HUB_HOSTS } from "@/constants/accounts";
import { SEO_SITE } from "@/constants/seo";
import { RestoreSignedIn, SignInWithOsu } from "@/lib/account";
import { getCurrentUser } from "@/lib/auth-session";
import { resolveNext, signInErrorText } from "@/utils/signin";

export const metadata: Metadata = pageMetadata(SEO_SITE, {
  path: "/signin",
  title: "Sign in",
  index: false,
});

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  const params = await searchParams;
  const next = resolveNext(params.next, { hosts: HUB_HOSTS, fallback: DEFAULT_AFTER_SIGN_IN });
  if (await getCurrentUser()) return <RestoreSignedIn next={next} />;
  const error = signInErrorText(params.error);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10 text-center">
      <PageHeader
        title="Sign in"
        lead="One osu! sign-in for packs, pools and bb. Browsing works without an account."
      />
      {error ? (
        <Text role="alert" tone="error" bold>
          {error}
        </Text>
      ) : null}
      <SignInWithOsu next={next} />
      <p className="text-c4 text-xs">
        We keep your osu! ID, username, avatar and country, and which devices are signed in. See the{" "}
        <TextLink href="/legal/privacy">privacy page</TextLink>.
      </p>
    </div>
  );
}
