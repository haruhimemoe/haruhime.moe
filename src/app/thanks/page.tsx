/**
 * @file src/app/thanks/page.tsx
 * @desc /thanks: the people and projects the tools lean on, from src/content/thanks.ts, with an
 *       osu!-style player card for every osu! player named (a snapshot, never fetched). Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
 */

import { Card, CardGrid, PageHeader, PlayerCard, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { THANKS } from "@/content/thanks";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/thanks");

export default function ThanksPage() {
  const t = useTranslations("hub.pages.thanks");
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={t("thanks")} lead={t("theseToolsLeanOn")} />
      <ul className="flex flex-col gap-3">
        {THANKS.map((entry) => (
          <li key={entry.name}>
            <Card>
              <p className="font-bold text-c1">
                {entry.url ? <TextLink href={entry.url}>{entry.name}</TextLink> : entry.name}
              </p>
              <p className="text-sm">{entry.line}</p>
              {entry.players ? (
                <CardGrid columns={3} gap="sm" className="mt-3">
                  {entry.players.map((player) => (
                    <PlayerCard
                      key={player.username}
                      username={player.username}
                      userId={player.osu?.id}
                      countryCode={player.osu?.country}
                      coverUrl={player.osu?.cover}
                      team={
                        player.osu?.team
                          ? { name: player.osu.team.name, flagUrl: player.osu.team.flag }
                          : undefined
                      }
                      supporter={player.osu?.supporter}
                      statusText={player.role}
                      statusNote={player.formerly ? `formerly ${player.formerly}` : undefined}
                    />
                  ))}
                </CardGrid>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
