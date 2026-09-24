/**
 * @file tests/components/layout/Footer.test.tsx
 * @desc Footer: Tools / haruhime.moe / Legal columns, unreleased tools as plain text, trademark notice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/constants/site";

describe("Footer", () => {
  it("has three labelled columns", () => {
    render(<Footer />);
    for (const name of ["Tools", "haruhime.moe", "Legal"]) {
      expect(screen.getByRole("navigation", { name })).toBeInTheDocument();
    }
  });

  it("links packs and shows pools and sheets as plain text marked soon", () => {
    render(<Footer />);
    const tools = screen.getByRole("navigation", { name: "Tools" });
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(1);
    for (const name of ["pools", "sheets"]) {
      expect(within(tools).getByText(name).parentElement).toHaveTextContent(`${name} soon`);
    }
  });

  it("links the site pages and GitHub", () => {
    render(<Footer />);
    const site = screen.getByRole("navigation", { name: "haruhime.moe" });
    const expected = [
      ["Thanks", "/thanks"],
      ["Brand", "/brand"],
      ["Contact", "/contact"],
      ["GitHub", "https://github.com/haruhimemoe"],
    ] as const;
    for (const [name, href] of expected) {
      expect(within(site).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    const legal = screen.getByRole("navigation", { name: "Legal" });
    expect(within(legal).getByRole("link", { name: "Disclaimer" })).toHaveAttribute(
      "href",
      "/disclaimer",
    );
  });

  it("keeps the trademark notice as fine print", () => {
    render(<Footer />);
    expect(screen.getByText(SITE.trademarkNotice)).toBeInTheDocument();
  });
});
