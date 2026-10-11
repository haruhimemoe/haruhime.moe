/**
 * @file src/components/layout/SiteShell.tsx
 * @desc The site frame, built from @haruhimemoe/ui: PageShell (skip link, #main) with SiteHeader
 *       (the wordmark as a home link, the tools centered beside it, a CommandPaletteButton in the
 *       actions slot beside the account menu) and SiteFooter (Tools, haruhime.moe and Legal columns, the trademark line,
 *       the Discord and GitHub icon links). AppPalette mounts the site's one CommandPalette here,
 *       so every page shares it and its Ctrl K / Cmd K hotkey. No parent wordmark in the footer:
 *       this is the parent site. The links live in src/constants/nav.ts. The account menu is
 *       client-side and asks for the session only when the signed-in marker is there, so the
 *       public pages stay static and read no cookies.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
 */

import {
  CommandPaletteButton,
  HaruhimeWordmark,
  PageShell,
  SiteFooter,
  SiteHeader,
} from "@haruhimemoe/ui";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AppPalette } from "@/components/layout/AppPalette";
import { LocalePicker } from "@/components/layout/LocalePicker";
import { accountMenuItems } from "@/constants/accounts";
import { footerColumns, headerLinks } from "@/constants/nav";
import { SITE } from "@/constants/site";
import { AccountMenu } from "@/lib/account";

/**
 * @function SiteShell
 * @param props {{ children: ReactNode }} the page
 * @returns {JSX.Element} the page inside the shared header, main landmark and footer
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const t = useTranslations("hub");
  const common = useTranslations("common");
  const ui = useTranslations("ui");
  return (
    <>
      <AppPalette />
      <PageShell
        skipLabel={ui("shell.skip")}
        header={
          <SiteHeader
            brand={
              <Link
                href="/"
                aria-label={t("nav.home", { name: SITE.name })}
                className="inline-flex shrink-0"
              >
                <HaruhimeWordmark decorative className="h-8 w-auto" />
              </Link>
            }
            links={headerLinks(t)}
            navLabel={t("nav.toolsNav")}
            navAlign="center"
            actions={
              <div className="flex items-center gap-2">
                <CommandPaletteButton label={ui("palette.openLabel")} />
                <AccountMenu
                  items={accountMenuItems(t)}
                  signInLabel={ui("account.signIn")}
                  signOutLabel={ui("account.signOut")}
                />
              </div>
            }
          />
        }
        footer={
          <SiteFooter
            columns={footerColumns(t, common)}
            navLabel={ui("shell.footerNav")}
            extra={<LocalePicker />}
            finePrint={t("footer.finePrint")}
            parentLink={false}
            githubHref={SITE.githubOrg}
            discordHref={SITE.discordUrl}
          />
        }
      >
        {children}
      </PageShell>
    </>
  );
}
