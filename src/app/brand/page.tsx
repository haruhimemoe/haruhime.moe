/**
 * @file src/app/brand/page.tsx
 * @desc /brand: how to write the name, logos and README banners to download, every haruhimemoe
 *       repo's README banner, colors, the product family, type and usage. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import { Card, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { linkStyles } from "@/components/ui/linkStyles";
import {
  BANNER_SIZE,
  BRAND_ASSETS,
  BRAND_BANNERS,
  BRAND_COLORS,
  REPO_BANNERS,
} from "@/constants/brand";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { cn } from "@/utils/cn";
import { hslToHex } from "@/utils/color";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "The haruhime.moe name, logos, colors, and type, plus the packs, pools and sheets icons and every repo's README banner.",
  alternates: { canonical: "/brand" },
  openGraph: { url: "/brand" },
};

export default function BrandPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Brand"
        lead="haruhime.moe is home to packs, pools and sheets, osu! tools for tournament hosts. For anything not covered here, write to me."
        meta={
          <a href={`mailto:${SITE.contactEmail}`} className={linkStyles}>
            {SITE.contactEmail}
          </a>
        }
      />
      <Card title="Name">
        <p className="text-sm">
          The name is written “haruhime.moe” in lower case, or “haruhime” when you mean the person.
          The tools are “packs”, “pools” and “sheets”, also lower case. Please don't write
          “Haruhime” or “HaruHime”.
        </p>
      </Card>
      <Card title="Logo">
        <ul className="grid gap-4 sm:grid-cols-3">
          {BRAND_ASSETS.map((asset) => (
            <li key={asset.href} className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex h-28 items-center justify-center rounded-[10px] p-4",
                  asset.background === "dark" ? "bg-b6" : "bg-white",
                )}
              >
                {/* biome-ignore lint/performance/noImgElement: static SVG preview, no optimization needed */}
                <img src={`/${asset.href}`} alt="" className="max-h-16 w-auto" />
              </div>
              <a href={`/${asset.href}`} download className={cn(linkStyles, "text-sm")}>
                Download {asset.label}
              </a>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 mb-1 font-bold text-c1">README banner</h3>
        <p className="mb-4 text-sm">
          For README headers, like the one on our{" "}
          <a href={SITE.githubOrg} className={linkStyles}>
            GitHub profile
          </a>
          .
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {BRAND_BANNERS.map((banner) => (
            <li key={banner.preview} className="flex flex-col gap-2">
              {/* biome-ignore lint/performance/noImgElement: static SVG preview, no optimization needed */}
              <img
                src={`/${banner.preview}`}
                alt=""
                width={BANNER_SIZE.width}
                height={BANNER_SIZE.height}
                className="h-auto w-full"
              />
              {banner.downloads.map((file) => (
                <a
                  key={file.href}
                  href={`/${file.href}`}
                  download
                  className={cn(linkStyles, "text-sm")}
                >
                  Download {file.label}
                </a>
              ))}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-c3 text-sm">
          Use the logos as they are: don't recolor or stretch them, and don't pair them with the
          osu! logo in a way that suggests ppy is involved.
        </p>
      </Card>
      <Card title="README banners">
        <p className="mb-4 text-sm">
          One for the top of each haruhimemoe repo's README. pools uses its own blue; everything
          else, packs included, uses haruhime's pink.
        </p>
        <ul className="grid gap-6 sm:grid-cols-2">
          {REPO_BANNERS.map((banner) => (
            <li key={banner.repo} className="flex flex-col gap-2">
              {/* biome-ignore lint/performance/noImgElement: static SVG preview, no optimization needed */}
              <img
                src={`/${banner.dark}`}
                alt=""
                width={BANNER_SIZE.width}
                height={BANNER_SIZE.height}
                loading="lazy"
                className="h-auto w-full"
              />
              <p className="text-sm">
                <a href={banner.href} className={cn(linkStyles, "font-bold")}>
                  haruhimemoe/{banner.repo}
                </a>
              </p>
              <p className="text-c3 text-sm">
                Download for{" "}
                <a
                  href={`/${banner.dark}`}
                  download
                  aria-label={`Download ${banner.repo} banner for dark backgrounds`}
                  className={linkStyles}
                >
                  dark
                </a>{" "}
                or{" "}
                <a
                  href={`/${banner.light}`}
                  download
                  aria-label={`Download ${banner.repo} banner for light backgrounds`}
                  className={linkStyles}
                >
                  light
                </a>{" "}
                backgrounds
              </p>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Colors">
        <ul className="grid gap-3 sm:grid-cols-3">
          {BRAND_COLORS.map((color) => (
            <li key={color.token} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-10 shrink-0 rounded-md border border-b3"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm">
                <span className="block font-bold text-c1">{color.name}</span>
                <span className="text-c4">{color.hex}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <a href="/brand/haruhime-palette.json" download className={cn(linkStyles, "text-sm")}>
            Download palette (JSON)
          </a>
        </p>
      </Card>
      <Card title="Product family">
        <p className="mb-4 text-sm">
          Each tool has its own icon and hue. The rest of its palette follows from the hue, the same
          way as the colors above.
        </p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => {
            const hex = hslToHex(tool.hue, 100, 70);
            return (
              <li key={tool.name} className="flex items-center gap-3">
                {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
                <img src={`/${tool.icon}`} alt="" width={64} height={64} className="size-12" />
                <span className="text-sm">
                  <span className="block font-bold text-c1">{tool.name}</span>
                  <span className="flex items-center gap-2 text-c4">
                    <span
                      aria-hidden="true"
                      className="size-3 rounded-full"
                      style={{ backgroundColor: hex }}
                    />
                    hue {tool.hue}, {hex}
                  </span>
                  <a href={`/${tool.icon}`} download className={cn(linkStyles, "mt-1 block")}>
                    Download {tool.name} icon
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card title="Type">
        <p className="text-sm">
          Nunito (Google Fonts, SIL Open Font License) in regular, bold, and extra bold.
        </p>
      </Card>
      <Card title="osu!">
        <p className="text-sm">{SITE.trademarkNotice}</p>
      </Card>
    </div>
  );
}
