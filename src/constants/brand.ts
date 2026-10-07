/**
 * @file src/constants/brand.ts
 * @desc Brand kit data for /brand: core color tokens (from @haruhimemoe/brand's palette at the hue
 *       in public/brand/haruhime-palette.json, kept in sync with the file and the @haruhimemoe/ui
 *       theme by tests; llms-full.txt reads them), and every haruhimemoe repo's README banner
 *       (written by scripts/repo-banners.ts into public/brand/repos). The logo files /brand offers
 *       come from @haruhimemoe/brand's brandPageData.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Tue Oct 6, 2026
 */

import { palette, TOKENS, type Token } from "@haruhimemoe/brand/palette";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import brandPalette from "../../public/brand/haruhime-palette.json" with { type: "json" };

const HUE = brandPalette.hue;
const COLORS = palette(HUE);

/**
 * @function swatch
 * @param token {Token} a theme token from @haruhimemoe/brand's TOKENS
 * @param name {string} the swatch's label on /brand
 * @returns {{token, name, hsl, hex}} the token at the site's hue, as HSL and as brand's hex
 */
const swatch = (token: Token, name: string) =>
  ({ token, name, hsl: [HUE, ...TOKENS[token]], hex: COLORS[token] }) as const;

/** Swatches shown on /brand, from @haruhimemoe/brand's TOKENS at the palette's hue. */
export const BRAND_COLORS = [
  swatch("b6", "Background"),
  swatch("b4", "Surface"),
  swatch("c1", "Text"),
  swatch("c3", "Muted text"),
  swatch("h1", "Pink"),
  swatch("h2", "Deep pink"),
] as const;

/**
 * What a repo's banner draws: a tool's own brand, by its @haruhimemoe/brand product key, or, for
 * a package (no `product`), its name in the parent's pink over a short line of its own.
 */
type RepoBannerSource = {
  product?: "haruhime" | "packs" | "pools" | "bb" | "harumin";
  /**
   * The line under the name, which /brand's preview reads out as alt text. A tool's comes from
   * its TOOLS entry, which copies its product's tagline so the page needn't draw with
   * @haruhimemoe/brand; a test keeps the two equal.
   */
  tagline: string;
};

/** One haruhimemoe repo's README banner: the repo, what it draws, and its two files. */
export type RepoBanner = RepoBannerSource & {
  /** The repo's name under github.com/haruhimemoe. */
  repo: string;
  /** The repo on GitHub. */
  href: string;
  /** The banner for dark backgrounds, under public/. */
  dark: string;
  /** The banner for light backgrounds, under public/. */
  light: string;
};

/**
 * @function repoBanner
 * @param repo {string} the repo's name under the GitHub org
 * @param source {RepoBannerSource} what its banner draws
 * @returns {RepoBanner} the repo's entry, its link and file names following from its name
 */
const repoBanner = (repo: string, source: RepoBannerSource): RepoBanner => ({
  ...source,
  repo,
  href: `${SITE.githubOrg}/${repo}`,
  dark: `brand/repos/${repo}-banner.svg`,
  light: `brand/repos/${repo}-banner-on-light.svg`,
});

/**
 * @function toolTagline
 * @param name {string} a tool's name in TOOLS
 * @returns {string} that tool's tagline, the one line of it this repo keeps
 * @throws {Error} when no tool has that name
 */
const toolTagline = (name: string): string => {
  const tool = TOOLS.find((entry) => entry.name === name);
  if (!tool) throw new Error(`No tool named ${name} in TOOLS`);
  return tool.tagline;
};

/** The haruhime product's tagline in @haruhimemoe/brand, under the site's and .github's name. */
const HARUHIME_TAGLINE = "osu! tools for players, mappers and hosts";

/**
 * Every haruhimemoe repo's README banner, in /brand's order: the parent site and the org profile
 * (the haruhime brand), the tools, then the packages and the Claude Code plugin. Taglines stay
 * short enough to fit the banner; a test measures them.
 */
export const REPO_BANNERS: readonly RepoBanner[] = [
  repoBanner("haruhime.moe", { product: "haruhime", tagline: HARUHIME_TAGLINE }),
  repoBanner(".github", { product: "haruhime", tagline: HARUHIME_TAGLINE }),
  repoBanner("packs.haruhime.moe", { product: "packs", tagline: toolTagline("packs") }),
  repoBanner("pools.haruhime.moe", { product: "pools", tagline: toolTagline("pools") }),
  repoBanner("bb.haruhime.moe", { product: "bb", tagline: toolTagline("bb") }),
  repoBanner("harumin.haruhime.moe", { product: "harumin", tagline: toolTagline("harumin") }),
  repoBanner("harumin", { product: "harumin", tagline: toolTagline("harumin") }),
  repoBanner("ui", { tagline: "@haruhimemoe/ui: React components and theme" }),
  repoBanner("osu", { tagline: "@haruhimemoe/osu: osu! API v2 client" }),
  repoBanner("hinai", { tagline: "@haruhimemoe/hinai: hinai beatmap mirror client" }),
  repoBanner("brand", { tagline: "@haruhimemoe/brand: logos, icons and banners" }),
  repoBanner("pool", { tagline: "@haruhimemoe/pool: osu! mappools as data" }),
  repoBanner("compliance", { tagline: "@haruhimemoe/compliance: osu! content rule checks" }),
  repoBanner("bbcode", { tagline: "@haruhimemoe/bbcode: parse and render osu! BBCode" }),
  repoBanner("next-kit", { tagline: "@haruhimemoe/next-kit: Next.js server kit" }),
  repoBanner("vcs", { tagline: "@haruhimemoe/vcs: diffs and merges for JSON" }),
  repoBanner("mirror", { tagline: "@haruhimemoe/mirror: .osz downloads with failover" }),
  repoBanner("time", { tagline: "@haruhimemoe/time: timezones and match slots" }),
  repoBanner("crowdfund", { tagline: "@haruhimemoe/crowdfund: crowdfunding as data" }),
  repoBanner("invites", { tagline: "@haruhimemoe/invites: invites as consent" }),
  repoBanner("tourney", { tagline: "@haruhimemoe/tourney: osu! tournaments as data" }),
  repoBanner("harumin-config", { tagline: "@haruhimemoe/harumin-config: harumin settings" }),
  repoBanner("claude-plugin", { tagline: "haruhime: osu! skills for Claude" }),
];

/** The README banner's size in pixels (the PNG's size and the SVGs' viewBox). */
export const BANNER_SIZE = { width: 1280, height: 320 } as const;
