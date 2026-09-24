/**
 * @file tests/components/app/BrandPage.test.tsx
 * @desc /brand: title, one h1, name rules, downloadable logos, swatches, product family, type, trademark notice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandPage, { metadata } from "@/app/brand/page";
import { BRAND_ASSETS, BRAND_COLORS } from "@/constants/brand";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";

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
    for (const color of BRAND_COLORS) {
      expect(screen.getByText(color.hex)).toBeInTheDocument();
    }
    expect(screen.getByText(/don't recolor or stretch them/)).toBeInTheDocument();
    expect(screen.getByText(/Nunito/)).toBeInTheDocument();
    expect(screen.getByText(SITE.trademarkNotice)).toBeInTheDocument();
  });

  it("shows the product family with icons and hues", () => {
    render(<BrandPage />);
    const family = screen.getByRole("region", { name: "Product family" });
    for (const tool of TOOLS) {
      expect(within(family).getByText(tool.name)).toBeInTheDocument();
      expect(within(family).getByText(new RegExp(`hue ${tool.hue}, #`))).toBeInTheDocument();
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
