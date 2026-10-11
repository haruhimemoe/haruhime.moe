/**
 * @file src/components/brand/ReadmeBanners.tsx
 * @desc /brand's README banners section, passed to BrandPage after the logos: every haruhimemoe
 *       repo's README banner from REPO_BANNERS, linked to its repo, with its tagline as alt text
 *       and dark and light downloads saved without a leading dot.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 11, 2026
 */

import { Card, Text, TextLink } from "@haruhimemoe/ui";
import { useTranslations } from "next-intl";
import { BANNER_SIZE, REPO_BANNERS } from "@/constants/brand";

// The name a download saves as: the file's own, minus a leading dot. .github's banners would
// otherwise save as hidden files on macOS and Linux (and browsers trim the dot anyway).
const saveAs = (file: string): string => file.slice(file.lastIndexOf("/") + 1).replace(/^\./, "");

/**
 * @function ReadmeBanners
 * @returns {JSX.Element} the README banners card, one item per repo
 */
export function ReadmeBanners() {
  const t = useTranslations("hub.readmeBanners");
  return (
    <Card title={t("readmeBanners")}>
      <p className="mb-4 text-sm">{t("oneForTheTop")}</p>
      <ul className="grid gap-6 sm:grid-cols-2">
        {REPO_BANNERS.map((banner) => (
          <li key={banner.repo} className="flex flex-col gap-2">
            {/* biome-ignore lint/performance/noImgElement: static SVG preview, no optimization needed */}
            <img
              src={`/${banner.dark}`}
              alt={t("repoBannerTagline", { repo: banner.repo, tagline: banner.tagline })}
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
            <Text tone="muted">
              Download for{" "}
              <TextLink
                href={`/${banner.dark}`}
                download={saveAs(banner.dark)}
                aria-label={t("downloadRepoBannerFor", { repo: banner.repo })}
                className="text-sm"
              >
                {t("dark")}
              </TextLink>{" "}
              or{" "}
              <TextLink
                href={`/${banner.light}`}
                download={saveAs(banner.light)}
                aria-label={t("downloadRepoBannerFor2", { repo: banner.repo })}
                className="text-sm"
              >
                {t("light")}
              </TextLink>{" "}
              backgrounds
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
