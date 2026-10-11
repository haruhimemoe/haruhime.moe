/**
 * @file src/app/account/page.tsx
 * @desc /account: the haruhime account center. The signed-in user's osu! name, avatar and id
 *       (linking their osu! profile), time display preferences (time zone, 12h/24h; every
 *       haruhime app reads them), sign out, the apps one account opens (packs, pools, bb), Discord linking
 *       (shown only when configured), "Download my data", where they're signed in (SessionsList: sign one device out,
 *       or everywhere else), and "Delete my account" with the typed-username confirmation. Sign-in
 *       otherwise; never indexed. Restores the header's signed-in marker for a session that has
 *       none.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
 */

import { osuAvatarSrc } from "@haruhimemoe/next-kit/auth-react";
import { readPreferences } from "@haruhimemoe/next-kit/preferences/server";
import { pageMetadata } from "@haruhimemoe/next-kit/seo";
import { userUrl } from "@haruhimemoe/osu/shapes";
import { Button, Card, PageHeader, Text, TextLink, textClasses } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { DiscordUnlink } from "@/components/account/DiscordUnlink";
import { PreferencesForm } from "@/components/account/PreferencesForm";
import { SessionsList } from "@/components/account/SessionsList";
import { CONNECTED_APPS } from "@/constants/accounts";
import { SEO_SITE } from "@/constants/seo";
import { RestoreSignedIn, SignOutButton } from "@/lib/account";
import { requireUser } from "@/lib/auth-session";
import { connectDb, getIdentityDb } from "@/lib/db";
import { discordEnabled, linkedDiscord } from "@/lib/discord";
import { listSessionRows } from "@/lib/sessions";

export const metadata: Metadata = pageMetadata(SEO_SITE, {
  path: "/account",
  title: "Account",
  index: false,
});

export default async function AccountPage() {
  const t = await getTranslations("hub.pages.account");
  const ui = await getTranslations("ui");
  const user = await requireUser("/account");
  const avatar = osuAvatarSrc(user.avatarUrl);
  const sessions = await listSessionRows(user.id, user.sessionId);
  const discord = discordEnabled() ? { name: await linkedDiscord(user.id) } : null;
  await connectDb();
  const preferences = await readPreferences(getIdentityDb(), user.id);
  return (
    <div className="flex flex-col gap-6">
      <RestoreSignedIn />
      <PageHeader
        title={t("account")}
        actions={
          <SignOutButton label={ui("account.signOut")} pendingLabel={ui("account.signingOut")} />
        }
      />
      <Card title={t("yourOsuAccount")}>
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
      <Card id="time" title={t("timeDisplay")}>
        <Text tone="muted">{t("everyHaruhimeAppShows")}</Text>
        <div className="mt-3">
          <PreferencesForm initial={preferences} />
        </div>
      </Card>
      <Card title={t("connectedApps")}>
        <Text tone="muted">{t("oneHaruhimeAccountSigns")}</Text>
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
              <span className="font-bold text-c1">{t("discord")}</span>
              <span className={textClasses({ tone: "muted" })}>
                {discord.name ? t("linkedAs", { name: discord.name }) : t("notLinked")}
              </span>
              {discord.name ? (
                <DiscordUnlink />
              ) : (
                <form method="post" action="/api/account/discord/start">
                  <Button type="submit" variant="ghost">
                    {t("connect")}
                  </Button>
                </form>
              )}
            </li>
          ) : null}
        </ul>
      </Card>
      <SessionsList initial={sessions} />
      <Card title={t("yourData")}>
        <Text tone="muted">{t("everythingHaruhimeAndIts")}</Text>
        <TextLink href="/api/account/export" variant="plain" className="mt-3 font-bold" download>
          {t("downloadMyData")}
        </TextLink>
      </Card>
      <Card title={t("deleteMyAccount")}>
        <DeleteAccount username={user.username} />
      </Card>
    </div>
  );
}
