/**
 * @file src/components/layout/LocalePicker.tsx
 * @desc The footer's language picker: ui's LocaleSelect on the shared .haruhime.moe cookie, and
 *       the pick saved to the signed-in account too (PATCH /api/account/locale; signed out, the
 *       401 is ignored), so a new device can start in it. Nothing shows until a second language
 *       exists.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

"use client";

import { LOCALES } from "@haruhimemoe/messages";
import { LocaleSelect } from "@haruhimemoe/ui";
import { useLocale, useTranslations } from "next-intl";

/**
 * @function LocalePicker
 * @returns {JSX.Element | null} the picker, or nothing with one language
 */
export function LocalePicker() {
  const ui = useTranslations("ui");
  return (
    <LocaleSelect
      locales={LOCALES}
      value={useLocale()}
      label={ui("shell.language")}
      cookieDomain=".haruhime.moe"
      onChange={(locale) => {
        void fetch("/api/account/locale", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale }),
        }).catch(() => undefined);
      }}
    />
  );
}
