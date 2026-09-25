/**
 * @file src/components/layout/SiteShell.tsx
 * @desc The site frame, built from @haruhimemoe/ui: PageShell (skip link, #main) with SiteHeader
 *       (the wordmark as a home link, the tools centered beside it) and SiteFooter (Tools,
 *       haruhime.moe and Legal columns, the trademark line, the Discord and GitHub icon links).
 *       No parent wordmark in the footer: this is the parent site. The links live in
 *       src/constants/nav.ts.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import { PageShell, SiteFooter, SiteHeader } from "@haruhimemoe/ui";
import Link from "next/link";
import type { ReactNode } from "react";
import { WORDMARK_SIZE } from "@/constants/brand";
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
            <Link href="/" className="inline-flex shrink-0">
              {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
              <img
                src="/brand/haruhime-wordmark.svg"
                alt={`${SITE.name} home`}
                width={WORDMARK_SIZE.width}
                height={WORDMARK_SIZE.height}
                className="h-8 w-auto"
              />
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
