/**
 * @file tests/components/app/ChangelogPage.test.tsx
 * @desc /changelog: its metadata title and one h1, the filter nav with All current, every repo's
 *       releases in the feed, a failed repo's note, a daily rebuild, and axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChangelogPage, { metadata, revalidate } from "@/app/changelog/page";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { expectNoAxeViolations } from "../../helpers/axe";

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

  it("marks All as the current filter", async () => {
    render(await ChangelogPage());
    const nav = screen.getByRole("navigation", { name: "Changelog filter" });
    expect(within(nav).getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
  });

  it("lists a release from every repo that loaded and names the one that didn't", async () => {
    render(await ChangelogPage());
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(CHANGELOG_SOURCES.length - 1);
    expect(screen.getByText(/Couldn't load the pools changelog/)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(await ChangelogPage());
    await expectNoAxeViolations(container);
  });
});
