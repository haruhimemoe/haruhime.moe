/**
 * @file src/app/brand/page.tsx
 * @desc /brand: how to write the name, the logos and README banners (haruhime.moe's and every
 *       haruhimemoe repo's) to download, colors, the product family, type and usage. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { palette } from "@haruhimemoe/brand/palette";
import { Card, cx, linkClasses, PageHeader, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import {
  BANNER_SIZE,
  BRAND_ASSETS,
  BRAND_BANNERS,
  BRAND_COLORS,
  REPO_BANNERS,
} from "@/constants/brand";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/brand");

// The name a download saves as: the file's own, minus a leading dot. .github's banners would
// otherwise save as hidden files on macOS and Linux (and browsers trim the dot anyway).
const saveAs = (file: string): string => file.slice(file.lastIndexOf("/") + 1).replace(/^\./, "");

export default function BrandPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Brand"
        lead="haruhime.moe is home to packs, pools, bb and sheets, osu! tools for players, mappers and tournament hosts. For anything not covered here, write to me."
        meta={<TextLink href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</TextLink>}
      />
      <Card title="Name">
        <p className="text-sm">
          The name is written “haruhime.moe” in lower case, or “haruhime” when you mean the person.
          The tools are “packs”, “pools”, “bb” and “sheets”, also lower case. Please don't write
          “Haruhime” or “HaruHime”.
        </p>
      </Card>
      <Card title="Logo">
        <ul className="grid gap-4 sm:grid-cols-3">
          {BRAND_ASSETS.map((asset) => (
            <li key={asset.href} className="flex flex-col gap-2">
              <div
                className={cx(
                  "flex h-28 items-center justify-center rounded-[10px] p-4",
                  asset.background === "dark" ? "bg-b6" : "bg-white",
                )}
              >
                {/* biome-ignore lint/performance/noImgElement: static SVG preview, no optimization needed */}
                <img src={`/${asset.href}`} alt="" className="max-h-16 w-auto" />
              </div>
              <a href={`/${asset.href}`} download className={linkClasses({ className: "text-sm" })}>
                Download {asset.label}
              </a>
            </li>
          ))}
        </ul>
        <h3 className="mt-6 mb-1 font-bold text-c1">haruhime.moe README banner</h3>
        <p className="mb-4 text-sm">
          For README headers, like the one on our{" "}
          <TextLink href={SITE.githubOrg}>GitHub profile</TextLink>.
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
                  className={linkClasses({ className: "text-sm" })}
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
          One for the top of each haruhimemoe repo's README. pools uses its own blue and bb its own
          violet; everything else, packs included, uses haruhime's pink.
        </p>
        <ul className="grid gap-6 sm:grid-cols-2">
          {REPO_BANNERS.map((banner) => (
            <li key={banner.repo} className="flex flex-col gap-2">
              {/* biome-ignore lint/performance/noImgElement: static SVG preview, no optimization needed */}
              <img
                src={`/${banner.dark}`}
                alt={`${banner.repo} banner: ${banner.tagline}`}
                width={BANNER_SIZE.width}
                height={BANNER_SIZE.height}
                loading="lazy"
                className="h-auto w-full"
              />
              <p className="text-sm">
                <TextLink href={banner.href} variant="plain">
                  haruhimemoe/{banner.repo}
                </TextLink>
              </p>
              <p className="text-c3 text-sm">
                Download for{" "}
                <a
                  href={`/${banner.dark}`}
                  download={saveAs(banner.dark)}
                  aria-label={`Download ${banner.repo} banner for dark backgrounds`}
                  className={linkClasses()}
                >
                  dark
                </a>{" "}
                or{" "}
                <a
                  href={`/${banner.light}`}
                  download={saveAs(banner.light)}
                  aria-label={`Download ${banner.repo} banner for light backgrounds`}
                  className={linkClasses()}
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
          <a href="/brand/haruhime-palette.json" download className={linkClasses()}>
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
            const hex = palette(tool.hue).h1;
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
                  <a
                    href={`/${tool.icon}`}
                    download
                    className={linkClasses({ className: "mt-1 block" })}
                  >
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
