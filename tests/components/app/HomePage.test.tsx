/**
 * @file tests/components/app/HomePage.test.tsx
 * @desc /: keyword title, canonical and og:image, one h1 naming players, mappers and hosts with
 *       no heading above it, haruhime's player card linked to their osu! profile, the Evergreen
 *       Cup banner first, the four tools (pools labeled beta,
 *       bb live, sheets coming soon) with task links, and the Organization (stable @id), Person
 *       and WebSite graph under the schema.org context.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage, { metadata } from "@/app/page";

describe("/", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({
      absolute: "osu! tools for players, mappers and hosts · haruhime.moe",
    });
    expect(metadata.alternates?.canonical).toBe("https://www.haruhime.moe/");
    expect(metadata.openGraph).toMatchObject({
      url: "https://www.haruhime.moe/",
      images: [expect.objectContaining({ url: "/opengraph-image.png" })],
    });
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "osu! tools for players, mappers and tournament hosts",
    );
    expect(screen.getAllByRole("heading")[0]).toBe(screen.getByRole("heading", { level: 1 }));
    expect(screen.getByText(/hellosu, haruhime here/)).toHaveTextContent(
      /bb is a BBCode editor for userpages and forum posts\.$/,
    );
  });

  it("shows haruhime's own player card, linked to their osu! profile", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: "Haruhime" })).toHaveAttribute(
      "href",
      "https://osu.ppy.sh/users/12231334",
    );
    expect(screen.getByText("hellosu idk what to put here")).toBeInTheDocument();
  });

  it("shows packs, pools and bb live, pools in beta, and sheets coming soon", () => {
    render(<HomePage />);
    // The section is headed, not a landmark: the footer's "Tools" region owns that name.
    expect(screen.queryByRole("region", { name: "Tools" })).toBeNull();
    const tools = screen.getByRole("heading", { name: "Tools" }).closest("section") as HTMLElement;
    const items = within(tools).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    for (const item of items) expect(item).toHaveClass("flex");
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "pools" })).toHaveAttribute(
      "href",
      "https://pools.haruhime.moe",
    );
    expect(within(tools).getByRole("link", { name: "bb" })).toHaveAttribute(
      "href",
      "https://bb.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(6);
    expect(within(tools).getByRole("link", { name: "Make a pack" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe/new",
    );
    expect(within(tools).getByRole("link", { name: "Make a pool" })).toHaveAttribute(
      "href",
      "https://pools.haruhime.moe/new",
    );
    expect(within(tools).getByRole("link", { name: "Make a collab banner" })).toHaveAttribute(
      "href",
      "https://bb.haruhime.moe/collab",
    );
    expect(within(tools).getAllByText("coming soon")).toHaveLength(1);
    const pools = within(tools).getByRole("link", { name: "pools" }).closest("li");
    // The beta pill sits right beside the name, before the tagline.
    expect(pools).toHaveTextContent(/^poolsbeta/);
    expect(within(tools).getAllByText("beta")).toHaveLength(1);
  });

  it("puts the Evergreen Cup banner first, above the intro", () => {
    const { container } = render(<HomePage />);
    const egc = screen.getByRole("region", { name: "Evergreen Cup" });
    expect(within(egc).getByRole("link", { name: "evergreencup.org" })).toHaveAttribute(
      "href",
      "https://evergreencup.org",
    );
    expect(container.firstElementChild?.firstElementChild).toBe(egc);
  });

  it("describes the site, its organization and its person as structured data", () => {
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
          "@id": "https://www.haruhime.moe/#organization",
          founder: { "@id": "https://www.haruhime.moe/#person" },
          sameAs: expect.arrayContaining(["https://discord.gg/bKy9kjMV4y"]),
        }),
        expect.objectContaining({
          "@type": "WebSite",
          "@id": "https://www.haruhime.moe/#website",
          publisher: { "@id": "https://www.haruhime.moe/#organization" },
          hasPart: [
            { "@id": "https://packs.haruhime.moe/#website" },
            { "@id": "https://pools.haruhime.moe/#website" },
            { "@id": "https://bb.haruhime.moe/#website" },
          ],
        }),
      ]),
    );
  });
});
