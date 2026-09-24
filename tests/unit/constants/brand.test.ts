/**
 * @file tests/unit/constants/brand.test.ts
 * @desc Brand swatches match the @haruhimemoe/ui theme at the hue globals.css sets; brand files
 *       and README banners exist, draw no text, and the banners are the size /brand says.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BANNER_SIZE, BRAND_ASSETS, BRAND_BANNERS, BRAND_COLORS } from "@/constants/brand";
import { hslToHex } from "@/utils/color";

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
const theme = readFileSync(
  createRequire(import.meta.url).resolve("@haruhimemoe/ui/theme.css"),
  "utf8",
);
const hue = Number(/--hue:\s*(\d+)/.exec(css)?.[1]);

describe("globals.css", () => {
  it("loads the @haruhimemoe/ui theme after Tailwind", () => {
    expect(css.indexOf('@import "tailwindcss";')).toBeGreaterThanOrEqual(0);
    expect(css.indexOf('@import "@haruhimemoe/ui/theme.css";')).toBeGreaterThan(
      css.indexOf('@import "tailwindcss";'),
    );
  });

  it("keeps the pink hue and the theme's default h1 and h2 lightness", () => {
    expect(hue).toBe(333);
    expect(css).not.toMatch(/--h[12]-l/);
  });
});

describe("BRAND_COLORS", () => {
  it.each(BRAND_COLORS.map((c) => [c.token, c] as const))(
    "%s matches the theme",
    (token, color) => {
      // h1 and h2 take their lightness from an override variable with a default:
      // hsl(var(--hue) 100% var(--h1-l, 70%)).
      const match = new RegExp(
        `--color-${token}: hsl\\(var\\(--hue\\) (\\d+)% (?:var\\(--${token}-l, (\\d+)%\\)|(\\d+)%)\\)`,
      ).exec(theme);
      expect(match).not.toBeNull();
      const [s, l] = [Number(match?.[1]), Number(match?.[2] ?? match?.[3])];
      expect(color.hsl).toEqual([hue, s, l]);
      expect(color.hex).toBe(hslToHex(hue, s, l));
    },
  );
});

describe("BRAND_ASSETS", () => {
  it.each(BRAND_ASSETS.map((a) => [a.href, a] as const))("%s exists in public/", (href) => {
    expect(existsSync(path.join(process.cwd(), "public", href))).toBe(true);
  });
});

describe("brand SVGs", () => {
  it.each(BRAND_ASSETS.map((a) => [a.href] as const))(
    "%s draws its letters as paths, so it looks the same without Nunito installed",
    (href) => {
      expect(readFileSync(path.join(process.cwd(), "public", href), "utf8")).not.toContain("<text");
    },
  );
});

describe("BRAND_BANNERS", () => {
  const files = BRAND_BANNERS.flatMap((banner) => [
    banner.preview,
    ...banner.downloads.map((file) => file.href),
  ]);
  const svgs = [...new Set(files.filter((href) => href.endsWith(".svg")))];

  it.each([...new Set(files)].map((href) => [href] as const))("%s exists in public/", (href) => {
    expect(existsSync(path.join(process.cwd(), "public", href))).toBe(true);
  });

  it.each(svgs.map((href) => [href] as const))(
    "%s draws its letters as paths, at the banner size",
    (href) => {
      const svg = readFileSync(path.join(process.cwd(), "public", href), "utf8");
      expect(svg).not.toContain("<text");
      expect(svg).toContain(`viewBox="0 0 ${BANNER_SIZE.width} ${BANNER_SIZE.height}"`);
    },
  );

  it("offers a PNG at the banner size", () => {
    const png = files.find((href) => href.endsWith(".png"));
    expect(png).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", png ?? ""));
    // IHDR: width and height are big-endian at bytes 16 and 20.
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([
      BANNER_SIZE.width,
      BANNER_SIZE.height,
    ]);
  });
});

describe("app metadata files", () => {
  it.each(["icon.svg", "apple-icon.png", "opengraph-image.png", "opengraph-image.alt.txt"])(
    "src/app/%s is committed",
    (file) => {
      expect(existsSync(path.join(process.cwd(), "src/app", file))).toBe(true);
    },
  );
});
