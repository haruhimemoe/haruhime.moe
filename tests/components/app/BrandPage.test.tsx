/**
 * @file tests/components/app/BrandPage.test.tsx
 * @desc /brand: title, one h1, name rules, downloadable logos and README banners, every repo's
 *       README banner linked to its repo, swatches, product family, type, trademark notice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandPage, { metadata } from "@/app/brand/page";
import { BRAND_ASSETS, BRAND_BANNERS, BRAND_COLORS, REPO_BANNERS } from "@/constants/brand";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { hslToHex } from "@/utils/color";

describe("/brand", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toBe("Brand");
    render(<BrandPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Brand" })).toBeInTheDocument();
  });

  it("covers name, logos, colors, type, and usage", () => {
    render(<BrandPage />);
    expect(screen.getByText(/written “haruhime.moe” in lower case/)).toBeInTheDocument();
    for (const asset of BRAND_ASSETS) {
      expect(screen.getByRole("link", { name: `Download ${asset.label}` })).toHaveAttribute(
        "href",
        `/${asset.href}`,
      );
    }
    expect(screen.getByRole("link", { name: "Download palette (JSON)" })).toHaveAttribute(
      "href",
      "/brand/haruhime-palette.json",
    );
    for (const color of BRAND_COLORS) {
      expect(screen.getByText(color.hex)).toBeInTheDocument();
    }
    expect(screen.getByText(/don't recolor or stretch them/)).toBeInTheDocument();
    expect(screen.getByText(/Nunito/)).toBeInTheDocument();
    expect(screen.getByText(SITE.trademarkNotice)).toBeInTheDocument();
  });

  it("offers the README banner, dark and light, next to the logos", () => {
    render(<BrandPage />);
    const logo = screen.getByRole("region", { name: "Logo" });
    expect(within(logo).getByRole("heading", { level: 3, name: "README banner" })).toBeVisible();
    expect(within(logo).getByText(/For README headers, like the one on our/)).toHaveTextContent(
      "For README headers, like the one on our GitHub profile.",
    );
    expect(within(logo).getByRole("link", { name: "GitHub profile" })).toHaveAttribute(
      "href",
      SITE.githubOrg,
    );
    for (const banner of BRAND_BANNERS) {
      expect(logo.querySelector(`img[src="/${banner.preview}"]`)).not.toBeNull();
    }
    for (const [name, href] of [
      ["Download banner for dark backgrounds", "/brand/haruhime-banner.svg"],
      ["Download banner for dark backgrounds (PNG)", "/brand/haruhime-banner.png"],
      ["Download banner for light backgrounds", "/brand/haruhime-banner-on-light.svg"],
    ]) {
      expect(within(logo).getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("shows every repo's README banner, linked to its repo, with both files to download", () => {
    render(<BrandPage />);
    const section = screen.getByRole("region", { name: "README banners" });
    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(11);
    REPO_BANNERS.forEach((banner, index) => {
      const item = within(items[index] as HTMLElement);
      expect(item.getByRole("link", { name: `haruhimemoe/${banner.repo}` })).toHaveAttribute(
        "href",
        `https://github.com/haruhimemoe/${banner.repo}`,
      );
      expect(items[index]?.querySelector("img")).toHaveAttribute(
        "src",
        `/brand/repos/${banner.repo}-banner.svg`,
      );
      for (const [background, href] of [
        ["dark", `/${banner.dark}`],
        ["light", `/${banner.light}`],
      ] as const) {
        const link = item.getByRole("link", {
          name: `Download ${banner.repo} banner for ${background} backgrounds`,
        });
        expect(link).toHaveAttribute("href", href);
        expect(link).toHaveAttribute("download");
        expect(link).toHaveTextContent(background);
      }
    });
  });

  it("shows the product family with icons and hues", () => {
    render(<BrandPage />);
    const family = screen.getByRole("region", { name: "Product family" });
    for (const tool of TOOLS) {
      expect(within(family).getByText(tool.name)).toBeInTheDocument();
      const hex = hslToHex(tool.hue, 100, 70);
      expect(within(family).getByText(`hue ${tool.hue}, ${hex}`)).toBeInTheDocument();
      expect(
        within(family).getByRole("link", { name: `Download ${tool.name} icon` }),
      ).toHaveAttribute("href", `/${tool.icon}`);
    }
  });

  it("links the contact email", () => {
    render(<BrandPage />);
    expect(screen.getByRole("link", { name: "contact@haruhime.moe" })).toHaveAttribute(
      "href",
      "mailto:contact@haruhime.moe",
    );
  });
});
