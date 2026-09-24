/**
 * @file tests/components/app/HomePage.test.tsx
 * @desc /: title, one h1, the three tools, the Evergreen Cup card, GitHub links, Organization + Person data.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage, { metadata } from "@/app/page";

describe("/", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({ absolute: "haruhime.moe: osu! tournament tools" });
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "hi, I'm haruhime." })).toBeVisible();
    expect(screen.getByRole("img", { name: "haruhime.moe" })).toHaveAttribute(
      "src",
      "/brand/haruhime-wordmark.svg",
    );
  });

  it("shows packs live and pools and sheets coming soon", () => {
    render(<HomePage />);
    const tools = screen.getByRole("region", { name: "Tools" });
    expect(within(tools).getAllByRole("listitem")).toHaveLength(3);
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(1);
    expect(within(tools).getAllByText("coming soon")).toHaveLength(2);
  });

  it("links Evergreen Cup and GitHub", () => {
    render(<HomePage />);
    const egc = screen.getByRole("region", { name: "Evergreen Cup" });
    expect(within(egc).getByRole("link", { name: "evergreencup.org" })).toHaveAttribute(
      "href",
      "https://evergreencup.org",
    );
    expect(screen.getByRole("link", { name: "github.com/haruhimemoe" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe",
    );
  });

  it("describes the site and its person as structured data", () => {
    const { container } = render(<HomePage />);
    const ld = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}",
    );
    expect(ld["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "@type": "Person", name: "haruhime" }),
        expect.objectContaining({
          "@type": "Organization",
          name: "haruhime.moe",
          url: "https://haruhime.moe",
          email: "contact@haruhime.moe",
        }),
      ]),
    );
  });
});
