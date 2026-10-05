/**
 * @file tests/components/app/ThanksPage.test.tsx
 * @desc /thanks: title, one h1, every entry from the thanks list, and a player card for every
 *       osu! player (profile links for the ones with an account, name only for the rest).
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Oct 5, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThanksPage, { metadata } from "@/app/thanks/page";
import { THANKS } from "@/content/thanks";

describe("/thanks", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({
      absolute: "Thanks and credits for haruhime's osu! tools · haruhime.moe",
    });
    render(<ThanksPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Thanks" })).toBeInTheDocument();
  });

  it("lists every entry, linked when it has a URL", () => {
    render(<ThanksPage />);
    for (const entry of THANKS) {
      expect(screen.getByText(entry.line)).toBeInTheDocument();
      if (entry.url) {
        const links = screen.getAllByRole("link", { name: entry.name });
        expect(links.filter((link) => link.getAttribute("href") === entry.url)).toHaveLength(1);
      } else {
        expect(screen.getByText(entry.name)).toBeInTheDocument();
      }
    }
  });

  it("draws a player card for every osu! player, linked to the profile when known", () => {
    const { container } = render(<ThanksPage />);
    const profiles = [...container.querySelectorAll('a[href^="https://osu.ppy.sh/users/"]')];
    expect(profiles).toHaveLength(11);
    expect(screen.getByRole("link", { name: "peppy" })).toHaveAttribute(
      "href",
      "https://osu.ppy.sh/users/2",
    );
    for (const name of ["Wyrd", "Rikki", "token"]) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
      const cardLinks = screen
        .queryAllByRole("link", { name })
        .filter((link) => link.getAttribute("href")?.startsWith("https://osu.ppy.sh/users/"));
      expect(cardLinks).toHaveLength(0);
    }
    expect(screen.getByText("formerly RMarc")).toBeInTheDocument();
    expect(screen.getByText("formerly Sohlayce")).toBeInTheDocument();
    expect(screen.getAllByText("osu!cafe")).toHaveLength(7);
    expect(screen.queryByText(/^(Online|Offline)$/)).toBeNull();
  });

  it("puts each player card in exactly one list item", () => {
    render(<ThanksPage />);
    for (const entry of THANKS) {
      if (!entry.players) continue;
      const card = screen.getByText(entry.line).closest("section") as HTMLElement;
      const list = within(card).getByRole("list");
      const items = [...list.children];
      expect(items).toHaveLength(entry.players.length);
      for (const item of items) expect(item).toHaveClass("flex");
    }
  });
});
