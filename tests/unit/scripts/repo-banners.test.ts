/**
 * @file tests/unit/scripts/repo-banners.test.ts
 * @desc scripts/repo-banners.ts: its list is exactly the 11 haruhimemoe repos, each writes
 *       public/brand/repos/<repo>-banner.svg and <repo>-banner-on-light.svg, tools draw their own
 *       product and packages the parent's hue with an "@haruhimemoe/<name>: " tagline
 *       (claude-plugin's opens "haruhime: "), each entry's tagline is the one its banner draws,
 *       every tagline and name fits the banner, the committed files match what the script writes,
 *       and .github's banners (served through next.config's rewrite) are haruhime.moe's.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Sep 25, 2026
 * @modified Fri Sep 25, 2026
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { layoutText, PRODUCTS } from "@haruhimemoe/brand";
import { describe, expect, it } from "vitest";
import { BANNER_SIZE, REPO_BANNERS } from "@/constants/brand";
import nextConfig from "../../../next.config";
import { markFor, productFor, repoBannerFiles } from "../../../scripts/repo-banners";

const REPOS = [
  "haruhime.moe",
  ".github",
  "packs.haruhime.moe",
  "pools.haruhime.moe",
  "ui",
  "osu",
  "hinai",
  "brand",
  "pool",
  "compliance",
  "claude-plugin",
];

// bannerSvg's type sizes (@haruhimemoe/brand 0.3.0): the name at 128px, the tagline at 40px.
const TITLE_SIZE = 128;
const TAGLINE_SIZE = 40;
// Each line keeps at least 128px clear on both sides of the 1280px banner.
const MAX_LINE = BANNER_SIZE.width - 2 * 128;

const inkWidth = (text: string, weight: 400 | 800, size: number): number => {
  const { ink } = layoutText(text, { weight, size });
  return ink.x2 - ink.x1;
};

describe("REPO_BANNERS", () => {
  it("covers exactly the 11 haruhimemoe repos, in order", () => {
    expect(REPO_BANNERS.map((banner) => banner.repo)).toEqual(REPOS);
  });

  it("links each repo on GitHub", () => {
    for (const banner of REPO_BANNERS) {
      expect(banner.href).toBe(`https://github.com/haruhimemoe/${banner.repo}`);
    }
  });
});

describe("repoBannerFiles", () => {
  const files = repoBannerFiles();

  it("writes <repo>-banner.svg and <repo>-banner-on-light.svg for every repo", () => {
    expect(files.map((file) => file.file)).toEqual(
      REPOS.flatMap((repo) => [
        `brand/repos/${repo}-banner.svg`,
        `brand/repos/${repo}-banner-on-light.svg`,
      ]),
    );
  });

  it("matches the committed files in public/", () => {
    for (const { file, svg } of files) {
      expect(readFileSync(path.join(process.cwd(), "public", file), "utf8")).toBe(svg);
    }
  });

  it("draws every banner at 1280x320, text as paths", () => {
    for (const { svg } of files) {
      expect(svg).toContain(`viewBox="0 0 ${BANNER_SIZE.width} ${BANNER_SIZE.height}"`);
      expect(svg).not.toContain("<text");
    }
  });
});

describe(".github's banners", () => {
  const read = (file: string): string =>
    readFileSync(path.join(process.cwd(), "public/brand/repos", file), "utf8");

  it("are haruhime.moe's, byte for byte, since next.config serves them from those files", async () => {
    for (const suffix of ["banner.svg", "banner-on-light.svg"]) {
      expect(read(`.github-${suffix}`)).toBe(read(`haruhime.moe-${suffix}`));
    }
    expect(await nextConfig.rewrites?.()).toMatchObject({
      beforeFiles: [
        { source: "/brand/repos/.github-:file", destination: "/brand/repos/haruhime.moe-:file" },
      ],
    });
  });
});

describe("productFor", () => {
  it("draws the tools with their own product", () => {
    const byRepo = new Map(REPO_BANNERS.map((banner) => [banner.repo, productFor(banner)]));
    expect(byRepo.get("haruhime.moe")).toBe(PRODUCTS.haruhime);
    expect(byRepo.get(".github")).toBe(PRODUCTS.haruhime);
    expect(byRepo.get("packs.haruhime.moe")).toBe(PRODUCTS.packs);
    expect(byRepo.get("pools.haruhime.moe")).toBe(PRODUCTS.pools);
  });

  it.each(REPO_BANNERS.filter((banner) => !banner.product).map((b) => [b.repo, b] as const))(
    "draws %s as a package: its name, the parent's hue, its repo",
    (repo, banner) => {
      const product = productFor(banner);
      expect(product.name).toBe(repo);
      expect(product.hue).toBe(PRODUCTS.haruhime.hue);
      expect(product.hue).toBe(333);
      expect(product.mark).toMatch(/^[a-z]{1,2}$/);
      expect(product.suffix).toBeUndefined();
      expect(product.url).toBe(`https://github.com/haruhimemoe/${repo}`);
      const prefix = repo === "claude-plugin" ? "haruhime: " : `@haruhimemoe/${repo}: `;
      expect(product.tagline.startsWith(prefix)).toBe(true);
      expect(product.tagline.length).toBeGreaterThan(prefix.length);
    },
  );

  it.each(REPO_BANNERS.map((banner) => [banner.repo, banner] as const))(
    "%s's tagline, which /brand's alt text reads, is the one its banner draws",
    (_repo, banner) => {
      expect(productFor(banner).tagline).toBe(banner.tagline);
    },
  );

  it.each(REPO_BANNERS.map((banner) => [banner.repo, banner] as const))(
    "%s's name and tagline fit the banner",
    (_repo, banner) => {
      const product = productFor(banner);
      expect(inkWidth(product.name, 800, TITLE_SIZE)).toBeLessThanOrEqual(MAX_LINE);
      expect(inkWidth(product.tagline, 400, TAGLINE_SIZE)).toBeLessThanOrEqual(MAX_LINE);
    },
  );
});

describe("markFor", () => {
  it("takes the first letters of a two-word name, or the first two letters of one word", () => {
    expect(markFor("claude-plugin")).toBe("cp");
    expect(markFor("ui")).toBe("ui");
    expect(markFor("hinai")).toBe("hi");
    expect(markFor("compliance")).toBe("co");
  });
});
