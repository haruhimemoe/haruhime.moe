/**
 * @file tests/components/app/LibrariesPage.test.tsx
 * @desc /libraries: its title and one h1, a card per library whose name links its docs page with
 *       the install line, stats and links, a dash where a lookup failed, and no axe violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Sun Oct 4, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LibrariesPage, { metadata, revalidate } from "@/app/libraries/page";
import { LIBRARIES } from "@/constants/libraries";
import { expectNoAxeViolations } from "../../helpers/axe";

vi.mock("@/lib/libraries/stats", () => ({
  fetchLibraryStats: vi.fn(async (library: { name: string }) =>
    library.name === "ui"
      ? {
          version: "0.6.0",
          license: "MIT",
          downloads: 1234,
          stars: 7,
          release: { tag: "v0.6.0", publishedAt: "2026-09-28T20:35:00Z" },
        }
      : { version: null, license: null, downloads: null, stars: null, release: null },
  ),
}));

const renderPage = async () => render(await LibrariesPage());

describe("/libraries", () => {
  it("has its title, one h1, and rebuilds daily", async () => {
    expect(metadata.title).toEqual({
      absolute: "Libraries: the @haruhimemoe packages · haruhime.moe",
    });
    expect(revalidate).toBe(86400);
    await renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Libraries" })).toBeInTheDocument();
    // Each card's name is an h2, straight under the page's h1: no skipped level.
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(LIBRARIES.length);
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  });

  it("shows a card per library, its name linking to its docs page", async () => {
    await renderPage();
    // The first list is the grid; each card holds its own list of links.
    const grid = screen.getAllByRole("list")[0] as HTMLElement;
    expect(grid.children).toHaveLength(LIBRARIES.length);
    for (const library of LIBRARIES) {
      const link = screen.getByRole("link", { name: library.pkg });
      expect(link).toHaveAttribute("href", `/libraries/${library.name}`);
      const card = link.closest("section") as HTMLElement;
      expect(within(card).getByText(`bun add ${library.pkg}`)).toBeInTheDocument();
      expect(within(card).getByRole("link", { name: "GitHub" })).toHaveAttribute(
        "href",
        `https://github.com/haruhimemoe/${library.repo}`,
      );
      expect(within(card).getByRole("link", { name: "Changelog" })).toHaveAttribute(
        "href",
        `/changelog/${library.name}`,
      );
    }
  });

  it("shows each library's README banner, decorative, from public/brand/repos", async () => {
    await renderPage();
    for (const library of LIBRARIES) {
      const card = screen
        .getByRole("link", { name: library.pkg })
        .closest("section") as HTMLElement;
      const img = card.querySelector("img");
      expect(img).toHaveAttribute("src", `/brand/repos/${library.repo}-banner.svg`);
      expect(img).toHaveAttribute("alt", "");
    }
  });

  it("links the ui showcase from the ui card only", async () => {
    await renderPage();
    const showcases = screen.getAllByRole("link", { name: "Showcase" });
    expect(showcases).toHaveLength(1);
    expect(showcases[0]).toHaveAttribute("href", "/ui");
    expect(showcases[0]?.closest("section")).toContainElement(
      screen.getByRole("link", { name: "@haruhimemoe/ui" }),
    );
  });

  it("shows ui's numbers and a dash for the libraries whose lookups failed", async () => {
    await renderPage();
    const ui = screen
      .getByRole("link", { name: "@haruhimemoe/ui" })
      .closest("section") as HTMLElement;
    expect(
      within(ui)
        .getAllByRole("definition")
        .map((d) => d.textContent),
    ).toEqual(["0.6.0", "1.2k", "7", "v0.6.0, Sep 28, 2026"]);
    const osu = screen
      .getByRole("link", { name: "@haruhimemoe/osu" })
      .closest("section") as HTMLElement;
    expect(
      within(osu)
        .getAllByRole("definition")
        .map((d) => d.textContent),
    ).toEqual(["—", "—", "—", "no release yet"]);
  });

  it("has no axe violations", async () => {
    const { container } = await renderPage();
    await expectNoAxeViolations(container);
  });
});
