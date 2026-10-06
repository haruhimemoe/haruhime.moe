/**
 * @file tests/components/app/BrandPage.test.tsx
 * @desc /brand: title, one h1, brandPageData("haruhime") through ui's BrandPage (name, logo and
 *       banner files, swatches, type, usage, the brand contact), no Family link on the family's
 *       own page, every repo's README banner right after the logos (linked to its repo, its
 *       tagline as alt text, download names without a leading dot), the product family last,
 *       no axe violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Tue Oct 6, 2026
 */

import { palette } from "@haruhimemoe/brand/palette";
import { brandPageData } from "@haruhimemoe/brand/products";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandPage, { metadata } from "@/app/brand/page";
import { REPO_BANNERS } from "@/constants/brand";
import { TOOLS } from "@/constants/tools";
import { expectNoAxeViolations } from "../../helpers/axe";

describe("/brand", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({
      absolute: "Brand kit: logos, colors and README banners · haruhime.moe",
    });
    render(<BrandPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Brand" })).toBeInTheDocument();
  });

  it('renders brandPageData("haruhime"): name, logo files, colors, type and usage', () => {
    render(<BrandPage />);
    const data = brandPageData("haruhime");
    expect(screen.getByText(data.writing)).toBeInTheDocument();
    for (const asset of data.assets) {
      expect(screen.getByRole("link", { name: asset.label })).toHaveAttribute("href", asset.href);
    }
    for (const hex of Object.values(data.palette)) {
      expect(screen.getAllByText(hex).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(data.donts[0] as string)).toBeInTheDocument();
    expect(screen.getByText(/Nunito/)).toBeInTheDocument();
    expect(screen.getByText(/osu! is a trademark of ppy Pty Ltd/)).toBeInTheDocument();
  });

  it("puts the README banners right after the logos and the product family last", () => {
    render(<BrandPage />);
    const names = screen
      .getAllByRole("region")
      .map((region) => region.getAttribute("aria-labelledby"))
      .map((id) => (id ? document.getElementById(id)?.textContent : null));
    expect(names.indexOf("README banners")).toBe(names.indexOf("Logo") + 1);
    expect(names.at(-1)).toBe("Product family");
  });

  it("hides the Family link on the family's own page", () => {
    render(<BrandPage />);
    expect(screen.queryByRole("region", { name: "Family" })).toBeNull();
    expect(screen.queryByText("Part of the haruhime.moe family.")).toBeNull();
  });

  it("shows every repo's README banner with alt text, its repo link and both files", () => {
    render(<BrandPage />);
    const section = screen.getByRole("region", { name: "README banners" });
    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(15);
    REPO_BANNERS.forEach((banner, index) => {
      const item = within(items[index] as HTMLElement);
      expect(item.getByRole("link", { name: `haruhimemoe/${banner.repo}` })).toHaveAttribute(
        "href",
        `https://github.com/haruhimemoe/${banner.repo}`,
      );
      const preview = item.getByRole("img", { name: `${banner.repo} banner: ${banner.tagline}` });
      expect(preview).toHaveAttribute("src", `/brand/repos/${banner.repo}-banner.svg`);
      const name = banner.repo.replace(/^\./, "");
      for (const [background, href, download] of [
        ["dark", `/${banner.dark}`, `${name}-banner.svg`],
        ["light", `/${banner.light}`, `${name}-banner-on-light.svg`],
      ] as const) {
        const link = item.getByRole("link", {
          name: `Download ${banner.repo} banner for ${background} backgrounds`,
        });
        expect(link).toHaveAttribute("href", href);
        expect(link).toHaveAttribute("download", download);
        expect(link).toHaveTextContent(background);
      }
    });
  });

  it("saves .github's banners without the leading dot, which would hide them", () => {
    render(<BrandPage />);
    for (const [background, download] of [
      ["dark", "github-banner.svg"],
      ["light", "github-banner-on-light.svg"],
    ]) {
      expect(
        screen.getByRole("link", { name: `Download .github banner for ${background} backgrounds` }),
      ).toHaveAttribute("download", download);
    }
  });

  it("shows the product family with icons and hues", () => {
    render(<BrandPage />);
    const family = screen.getByRole("region", { name: "Product family" });
    for (const tool of TOOLS) {
      expect(within(family).getByText(tool.name)).toBeInTheDocument();
      const hex = palette(tool.hue).h1;
      expect(within(family).getByText(`hue ${tool.hue}, ${hex}`)).toBeInTheDocument();
      expect(
        within(family).getByRole("link", { name: `Download ${tool.name} icon` }),
      ).toHaveAttribute("href", `/${tool.icon}`);
    }
  });

  it("links the brand contact from brandPageData", () => {
    render(<BrandPage />);
    expect(screen.getByRole("link", { name: "haruhime@haruhime.moe" })).toHaveAttribute(
      "href",
      "mailto:haruhime@haruhime.moe",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<BrandPage />);
    await expectNoAxeViolations(container);
  });
});
