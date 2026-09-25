/**
 * @file scripts/repo-banners.ts
 * @desc `bun run repo-banners [--png <dir>]`: writes every haruhimemoe repo's README banner, dark
 *       and light, into public/brand/repos with @haruhimemoe/brand's bannerSvg. The repos come
 *       from REPO_BANNERS (src/constants/brand.ts). A tool draws its own product; a package
 *       draws a made-up product: its name in the parent's hue over its own tagline. `--png <dir>`
 *       also renders each banner to a 1280-wide PNG in <dir>, to look at before committing (the
 *       PNGs aren't committed).
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Sep 25, 2026
 * @modified Fri Sep 25, 2026
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { bannerSvg, PRODUCTS, type Product, svgToPng } from "@haruhimemoe/brand";
import { BANNER_SIZE, REPO_BANNERS, type RepoBanner } from "@/constants/brand";

/**
 * @function markFor
 * @param name {string} a repo's short name ("ui", "claude-plugin")
 * @returns {string} its monogram: the first letter of each of the first two words, or the first
 *          two letters of a one-word name ("cp", "ui", "hi")
 */
export const markFor = (name: string): string => {
  const [first = "", second] = name.split(/[^a-z]+/).filter(Boolean);
  return second ? first.charAt(0) + second.charAt(0) : name.slice(0, 2);
};

/**
 * @function productFor
 * @param banner {RepoBanner} a repo's entry
 * @returns {Product} the tool's own product, or a package's: its name, the parent's hue, its
 *          tagline and its GitHub repo
 */
export const productFor = (banner: RepoBanner): Product =>
  banner.product
    ? PRODUCTS[banner.product]
    : {
        name: banner.repo,
        mark: markFor(banner.repo),
        hue: PRODUCTS.haruhime.hue,
        tagline: banner.tagline,
        url: banner.href,
      };

/** One file the script writes: its path under public/ and its SVG. */
export type BannerFile = { file: string; svg: string };

/**
 * @function repoBannerFiles
 * @returns {BannerFile[]} every repo's dark banner, then its light one, in REPO_BANNERS order
 */
export const repoBannerFiles = (): BannerFile[] =>
  REPO_BANNERS.flatMap((banner) => {
    const product = productFor(banner);
    return [
      { file: banner.dark, svg: bannerSvg(product) },
      { file: banner.light, svg: bannerSvg(product, { background: "light" }) },
    ];
  });

if (import.meta.main) {
  const root = path.join(import.meta.dirname, "..");
  const pngFlag = process.argv.indexOf("--png");
  const pngDir = pngFlag === -1 ? undefined : process.argv[pngFlag + 1];
  if (pngFlag !== -1 && !pngDir) throw new Error("usage: bun run repo-banners [--png <dir>]");
  for (const { file, svg } of repoBannerFiles()) {
    const target = path.join(root, "public", file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, svg);
    console.log(`wrote public/${file}`);
    if (pngDir) {
      mkdirSync(pngDir, { recursive: true });
      const png = path.join(pngDir, path.basename(file).replace(/\.svg$/, ".png"));
      writeFileSync(png, svgToPng(svg, BANNER_SIZE.width));
      console.log(`rendered ${png}`);
    }
  }
}
