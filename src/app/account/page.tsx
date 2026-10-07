/**
 * @file src/app/account/page.tsx
 * @desc /account: the haruhime account center. The signed-in user's osu! name, avatar and id
 *       (linking their osu! profile), sign out, the apps one account opens (packs, pools, bb), Discord linking
 *       (shown only when configured), "Download my data", where they're signed in (SessionsList: sign one device out,
 *       or everywhere else), and "Delete my account" with the typed-username confirmation. Sign-in
 *       otherwise; never indexed. Restores the header's signed-in marker for a session that has
 *       none.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { osuAvatarSrc } from "@haruhimemoe/next-kit/auth-react";
import { pageMetadata } from "@haruhimemoe/next-kit/seo";
import { userUrl } from "@haruhimemoe/osu/shapes";
import { Button, Card, PageHeader, Text, TextLink, textClasses } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import Image from "next/image";
import { DiscordUnlink } from "@/components/account/DiscordUnlink";
import { SessionsList } from "@/components/account/SessionsList";
import { CONNECTED_APPS } from "@/constants/accounts";
import { SEO_SITE } from "@/constants/seo";
import { DeleteAccountForm, RestoreSignedIn, SignOutButton } from "@/lib/account";
import { requireUser } from "@/lib/auth-session";
import { discordEnabled, linkedDiscord } from "@/lib/discord";
import { listSessionRows } from "@/lib/sessions";

export const metadata: Metadata = pageMetadata(SEO_SITE, {
  path: "/account",
  title: "Account",
  index: false,
});

export default async function AccountPage() {
  const user = await requireUser("/account");
  const avatar = osuAvatarSrc(user.avatarUrl);
  const sessions = await listSessionRows(user.id, user.sessionId);
  const discord = discordEnabled() ? { name: await linkedDiscord(user.id) } : null;
  return (
    <div className="flex flex-col gap-6">
      <RestoreSignedIn />
      <PageHeader title="Account" actions={<SignOutButton />} />
      <Card title="Your osu! account">
        <div className="flex items-center gap-3">
          {avatar ? (
            // Unoptimized: osu!'s avatar host, shown as is.
            <Image
              src={avatar}
              alt=""
              width={48}
              height={48}
              unoptimized
              className="rounded-full"
            />
          ) : null}
          <div className="flex flex-col">
            <TextLink href={userUrl(user.osuId)} rel="noopener" variant="plain" className="text-lg">
              {user.username}
            </TextLink>
            <Text tone="muted">osu! ID {user.osuId}</Text>
          </div>
        </div>
      </Card>
      <Card title="Connected apps">
        <Text tone="muted">One haruhime account signs you in to each of these.</Text>
        <ul className="mt-3 flex flex-col gap-2">
          {CONNECTED_APPS.map((app) => (
            <li key={app.name}>
              <TextLink href={app.url} variant="plain" className="font-bold">
                {app.name}
              </TextLink>{" "}
              <span className={textClasses({ tone: "muted" })}>{app.line}</span>
            </li>
          ))}
          {discord ? (
            <li className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-c1">Discord</span>
              <span className={textClasses({ tone: "muted" })}>
                {discord.name ? `Linked as ${discord.name}.` : "Not linked."}
              </span>
              {discord.name ? (
                <DiscordUnlink />
              ) : (
                <form method="post" action="/api/account/discord/start">
                  <Button type="submit" variant="ghost">
                    Connect
                  </Button>
                </form>
              )}
            </li>
          ) : null}
        </ul>
      </Card>
      <SessionsList initial={sessions} />
      <Card title="Your data">
        <Text tone="muted">Everything haruhime and its apps keep about you, as one JSON file.</Text>
        <TextLink href="/api/account/export" variant="plain" className="mt-3 font-bold" download>
          Download my data
        </TextLink>
      </Card>
      <Card title="Delete my account">
        <DeleteAccountForm
          username={user.username}
          appName="haruhime.moe"
          deletes="This deletes your haruhime account and signs you out of packs, pools and bb on every device. It also deletes what you made inside each app. It can't be undone."
        />
      </Card>
    </div>
  );
}
