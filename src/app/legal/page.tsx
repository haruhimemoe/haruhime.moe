/**
 * @file src/app/legal/page.tsx
 * @desc /legal: every legal page with its description, from the registry. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { pageMetadata } from "@haruhimemoe/next-kit/seo";
import { ContentIndex, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { CONTENT } from "@/constants/content";
import { SEO_SITE } from "@/constants/seo";
import { toNavItem } from "@/utils/content-nav";

export const metadata: Metadata = pageMetadata(SEO_SITE, {
  path: "/legal",
  title: "Legal: disclaimer, terms and privacy",
  description:
    "The haruhime.moe disclaimer, terms of use and privacy policy. Each tool (packs, pools, bb) has its own terms and privacy policy on its own site.",
});

const ITEMS = CONTENT.entries.legal.map(toNavItem("legal"));

export default function LegalIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Legal" lead="The disclaimer, the terms and what this site collects." />
      <ContentIndex items={ITEMS} />
    </div>
  );
}
