/**
 * @file tests/components/app/ChangelogPage.test.tsx
 * @desc /changelog: its metadata title and one h1, the changelog nav (All releases first and
 *       current, Apps, Packages and Claude plugin, each repo with its latest version), every
 *       repo's releases under a date heading as closable cards with only the newest open, a
 *       failed repo's note, a daily rebuild, and axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChangelogPage, { metadata, revalidate } from "@/app/changelog/page";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { expectNoAxeViolations } from "../../helpers/axe";

vi.mock("next/navigation.js", () => ({ usePathname: () => "/changelog" }));
vi.mock("@/lib/changelogs", () => ({
  fetchAllChangelogs: vi.fn(async () =>
    CHANGELOG_SOURCES.map((source) =>
      source.slug === "pools"
        ? { source, error: true as const }
        : {
            source,
            changelog: {
              unreleased: [],
              releases: [
                {
                  version: "0.1.0",
                  date: "2026-10-01",
                  sections: [{ name: "Added" as const, items: [`${source.slug} launch`] }],
                },
              ],
              references: [],
            },
          },
    ),
  ),
}));

describe("/changelog", () => {
  it("is titled Changelog with one h1 and rebuilds daily", async () => {
    expect(metadata.title).toEqual({
      absolute: "Changelog: haruhime's osu! tools and packages · haruhime.moe",
    });
    expect(revalidate).toBe(86400);
    render(await ChangelogPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Changelog" })).toBeInTheDocument();
  });

  it("lists All releases first and current, then each kind with its repos and versions", async () => {
    render(await ChangelogPage());
    const [nav] = screen.getAllByRole("navigation", { name: "Changelogs" });
    const links = within(nav as HTMLElement).getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/changelog");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links.filter((a) => a.getAttribute("aria-current") === "page")).toHaveLength(1);
    expect(within(nav as HTMLElement).getByText("Apps")).toBeInTheDocument();
    expect(within(nav as HTMLElement).getByText("Packages")).toBeInTheDocument();
    expect(within(nav as HTMLElement).getByText("Claude plugin")).toBeInTheDocument();
    expect(within(nav as HTMLElement).getByRole("link", { name: "All apps" })).toHaveAttribute(
      "href",
      "/changelog/kind/apps",
    );
    expect(
      within(nav as HTMLElement).getByRole("link", { name: /^ui\s*0\.1\.0$/ }),
    ).toHaveAttribute("href", "/changelog/ui");
    // pools failed to load, so it has no version badge.
    expect(within(nav as HTMLElement).getByRole("link", { name: "pools" })).toBeInTheDocument();
  });

  it("groups releases under their date, one card each, only the newest open", async () => {
    const { container } = render(await ChangelogPage());
    const days = screen.getAllByRole("heading", { level: 2 });
    expect(days.map((h) => h.textContent)).toEqual(["October 1, 2026"]);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(CHANGELOG_SOURCES.length - 1);
    const cards = [...container.querySelectorAll("section details")] as HTMLDetailsElement[];
    expect(cards).toHaveLength(CHANGELOG_SOURCES.length - 1);
    expect(cards.map((d) => d.open)).toEqual(cards.map((_, i) => i === 0));
    expect(cards[0]?.querySelector("summary")).toHaveTextContent(/1 added/);
    expect(screen.getByText(/Couldn't load the pools changelog/)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(await ChangelogPage());
    await expectNoAxeViolations(container);
  });
});
