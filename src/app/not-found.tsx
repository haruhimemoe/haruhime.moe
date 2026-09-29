/**
 * @file src/app/not-found.tsx
 * @desc 404 page: a short message and a link home, titled "Page not found · haruhime.moe" and
 *       noindex.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { notFoundMetadata } from "@haruhimemoe/next-kit/seo";
import { ButtonLink, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { SEO_SITE } from "@/constants/seo";

export const metadata: Metadata = notFoundMetadata(SEO_SITE);

export default function NotFound() {
  return (
    <PageHeader
      title="Page not found"
      lead="That page doesn't exist, or it moved."
      actions={
        <ButtonLink href="/" variant="secondary">
          Back home
        </ButtonLink>
      }
    />
  );
}
