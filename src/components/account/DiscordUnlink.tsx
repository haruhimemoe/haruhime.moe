/**
 * @file src/components/account/DiscordUnlink.tsx
 * @desc /account's "Unlink" for a linked Discord: POST /api/account/discord, then refresh the
 *       page so the row shows "Not linked".
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Sun Oct 11, 2026
 */

"use client";

import { AsyncButton } from "@haruhimemoe/ui";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function DiscordUnlink() {
  const t = useTranslations("hub.discordUnlink");
  const router = useRouter();
  return (
    <AsyncButton
      variant="ghost"
      failedMessage={t("couldnTUnlinkTry")}
      action={async () => {
        const res = await fetch("/api/account/discord", { method: "POST" });
        if (!res.ok) throw new Error(String(res.status));
        router.refresh();
        return t("unlinked");
      }}
    >
      {t("unlink")}
    </AsyncButton>
  );
}
