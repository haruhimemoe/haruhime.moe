/**
 * @file src/components/layout/SiteShell.tsx
 * @desc The site frame, built from @haruhimemoe/ui: PageShell (skip link, #main) with SiteHeader
 *       (the wordmark as a home link, the tools centered beside it) and SiteFooter (Tools,
 *       haruhime.moe and Legal columns, the trademark line, the Discord and GitHub icon links).
 *       No parent wordmark in the footer: this is the parent site. The links live in
 *       src/constants/nav.ts.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { HaruhimeWordmark, PageShell, SiteFooter, SiteHeader } from "@haruhimemoe/ui";
import Link from "next/link";
import type { ReactNode } from "react";
import { FOOTER_COLUMNS, HEADER_LINKS } from "@/constants/nav";
import { SITE } from "@/constants/site";

/**
 * @function SiteShell
 * @param props {{ children: ReactNode }} the page
 * @returns {JSX.Element} the page inside the shared header, main landmark and footer
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <PageShell
      header={
        <SiteHeader
          brand={
            <Link href="/" aria-label={`${SITE.name} home`} className="inline-flex shrink-0">
              <HaruhimeWordmark decorative className="h-8 w-auto" />
            </Link>
          }
          links={HEADER_LINKS}
          navLabel="Tools"
          navAlign="center"
        />
      }
      footer={
        <SiteFooter
          columns={FOOTER_COLUMNS}
          finePrint={SITE.trademarkNotice}
          parentLink={false}
          githubHref={SITE.githubOrg}
          discordHref={SITE.discordUrl}
        />
      }
    >
      {children}
    </PageShell>
  );
}
