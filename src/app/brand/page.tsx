/**
 * @file src/app/brand/page.tsx
 * @desc /brand: the haruhime.moe name, how to write it, logo and banner files, colors, type, do's
 *       and don'ts and the contact, from @haruhimemoe/brand's brandPageData("haruhime") rendered
 *       by @haruhimemoe/ui's BrandPage (files in public/brand come from `haruhime-brand`). The
 *       parent site adds every repo's README banner after the logos and the product family at
 *       the end; BrandPage hides its Family link here, since this is the family's page. The lead's
 *       "write to me" mails the same contact BrandPage shows, so the page has one address. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 4, 2026
 */

import { brandPageData } from "@haruhimemoe/brand/products";
import { BrandPage, linkClasses, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { ProductFamily } from "@/components/brand/ProductFamily";
import { ReadmeBanners } from "@/components/brand/ReadmeBanners";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/brand");

export default function BrandRoute() {
  const data = brandPageData("haruhime");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Brand"
        lead={
          <>
            haruhime.moe is home to packs, pools, bb and sheets, osu! tools for players, mappers and
            tournament hosts. For anything not covered here,{" "}
            <a href={`mailto:${data.contact}`} className={linkClasses()}>
              write to me
            </a>
            .
          </>
        }
      />
      <BrandPage {...data} slots={{ afterLogo: <ReadmeBanners />, end: <ProductFamily /> }} />
    </div>
  );
}
