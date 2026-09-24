/**
 * @file tests/components/app/HomePage.test.tsx
 * @desc /: title, one h1, the Evergreen Cup banner first, the three tools, Organization + Person
 *       data under the schema.org context.
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
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
  });

  it("shows packs and pools live and sheets coming soon", () => {
    render(<HomePage />);
    const tools = screen.getByRole("region", { name: "Tools" });
    expect(within(tools).getAllByRole("listitem")).toHaveLength(3);
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "pools" })).toHaveAttribute(
      "href",
      "https://pools.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(2);
    expect(within(tools).getAllByText("coming soon")).toHaveLength(1);
  });

  it("puts the Evergreen Cup banner first, above the intro", () => {
    const { container } = render(<HomePage />);
    const egc = screen.getByRole("region", { name: "Evergreen Cup" });
    expect(within(egc).getByRole("link", { name: "Visit evergreencup.org" })).toHaveAttribute(
      "href",
      "https://evergreencup.org",
    );
    expect(container.firstElementChild?.firstElementChild).toBe(egc);
  });

  it("describes the site and its person as structured data", () => {
    const { container } = render(<HomePage />);
    const ld = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}",
    );
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "@type": "Person", name: "haruhime" }),
        expect.objectContaining({
          "@type": "Organization",
          name: "haruhime.moe",
          url: "https://www.haruhime.moe",
          email: "contact@haruhime.moe",
          logo: "https://www.haruhime.moe/apple-icon.png",
        }),
      ]),
    );
  });
});
