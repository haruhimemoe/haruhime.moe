/**
 * @file src/components/account/DeleteAccount.tsx
 * @desc "Delete my account" in the page's language: next-kit's DeleteAccountForm (bound in
 *       lib/account.ts) with its words from the ui catalog. A client file, since the labels
 *       carry functions a server page can't hand over.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

"use client";

import { uiLabels } from "@haruhimemoe/next-kit/i18n";
import { useTranslations } from "next-intl";
import { DeleteAccountForm } from "@/lib/account";

/**
 * @function DeleteAccount
 * @param props {{ username: string }} the signed-in osu! username
 * @returns {JSX.Element} the delete trigger and its dialog
 */
export function DeleteAccount({ username }: { username: string }) {
  const t = useTranslations("hub.pages.account");
  const ui = uiLabels(useTranslations("ui"));
  return (
    <DeleteAccountForm
      username={username}
      appName="haruhime.moe"
      deletes={t("deletes")}
      homeLabel={ui.account.home}
      labels={ui.deleteAccount}
    />
  );
}
