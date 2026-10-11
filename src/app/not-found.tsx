/**
 * @file src/app/not-found.tsx
 * @desc 404 page: a short message and a link home, titled "Page not found · haruhime.moe" and
 *       noindex.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
 */

import { notFoundMetadata } from "@haruhimemoe/next-kit/seo";
import { ButtonLink, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { SEO_SITE } from "@/constants/seo";

export const metadata: Metadata = notFoundMetadata(SEO_SITE);

export default function NotFound() {
  const t = useTranslations("hub.pages.rootNotFound");
  return (
    <PageHeader
      title={t("pageNotFound")}
      lead={t("thatPageDoesnT")}
      actions={
        <ButtonLink href="/" variant="secondary">
          {t("backHome")}
        </ButtonLink>
      }
    />
  );
}
