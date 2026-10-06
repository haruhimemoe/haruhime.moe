/**
 * @file tests/components/changelog/ChangelogFeed.test.tsx
 * @desc ChangelogFeed: one h2 per date, each release a <details> card whose summary holds an h3
 *       (repo badge and version) and its change counts, only the newest open, a link inside to
 *       its anchor on the repo page; the "more" line; one note per failed repo with its GitHub
 *       link; an empty feed; "No releases yet." only when there are no entries AND no failures;
 *       no duplicate ids; axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChangelogFeed } from "@/components/changelog/ChangelogFeed";
import { findChangelogSource } from "@/constants/changelogs";
import type { Feed } from "@/utils/changelog-feed";
import { expectNoAxeViolations } from "../../helpers/axe";

const ui = findChangelogSource("ui") as NonNullable<ReturnType<typeof findChangelogSource>>;
const pools = findChangelogSource("pools") as NonNullable<ReturnType<typeof findChangelogSource>>;

const feed = (count: number, extra: Partial<Feed> = {}): Feed => ({
  entries: Array.from({ length: count }, (_, i) => ({
    source: ui,
    release: {
      version: `0.${count - i}.0`,
      date: i < 2 ? "2026-10-03" : "2026-10-01",
      sections: [
        { name: "Added" as const, items: [`item ${i}`, `more ${i}`] },
        { name: "Fixed" as const, items: [`fix ${i}`] },
      ],
    },
    references: [],
  })),
  more: false,
  failed: [],
  ...extra,
});

describe("ChangelogFeed", () => {
  it("groups releases under their date, one card each, only the newest open", () => {
    const { container } = render(<ChangelogFeed feed={feed(4)} />);
    const days = screen.getAllByRole("heading", { level: 2 });
    expect(days.map((h) => h.textContent)).toEqual(["October 3, 2026", "October 1, 2026"]);
    expect(days[0]?.querySelector("time")).toHaveAttribute("dateTime", "2026-10-03");
    const firstDay = screen.getByRole("region", { name: "October 3, 2026" });
    expect(within(firstDay).getAllByRole("heading", { level: 3 })).toHaveLength(2);
    const cards = [...container.querySelectorAll("details")];
    expect(cards.map((d) => d.open)).toEqual([true, false, false, false]);
    const summary = cards[0]?.querySelector("summary");
    expect(summary).toHaveTextContent("ui0.4.0");
    expect(summary).toHaveTextContent("2 added, 1 fixed");
    expect(summary?.querySelector("h3")).toHaveTextContent("ui0.4.0");
    expect(summary?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("links each release to its anchor on the repo page, inside the card", () => {
    render(<ChangelogFeed feed={feed(2)} />);
    expect(screen.getByRole("link", { name: "ui 0.2.0 in the ui changelog" })).toHaveAttribute(
      "href",
      "/changelog/ui#v0-2-0",
    );
    expect(screen.getAllByRole("heading", { level: 4, name: "Added" })).toHaveLength(2);
  });

  it("puts an undated release under No date", () => {
    const undated = feed(1);
    const entry = undated.entries[0] as Feed["entries"][number];
    render(
      <ChangelogFeed
        feed={{ ...undated, entries: [{ ...entry, release: { ...entry.release, date: null } }] }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "No date" })).toBeInTheDocument();
  });

  it("repeats no id across releases", () => {
    const { container } = render(<ChangelogFeed feed={feed(7)} />);
    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points at the repo pages when older releases were cut", () => {
    render(<ChangelogFeed feed={feed(1, { more: true })} />);
    expect(
      screen.getByText(/Older releases are on each repo's own changelog page/),
    ).toBeInTheDocument();
  });

  it("names a repo that failed to load and links its changelog on GitHub", () => {
    render(<ChangelogFeed feed={feed(1, { failed: [pools] })} />);
    expect(screen.getByText(/Couldn't load the pools changelog/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "the pools CHANGELOG.md on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe/pools.haruhime.moe/blob/main/CHANGELOG.md",
    );
  });

  it("says so when there are no releases", () => {
    render(<ChangelogFeed feed={feed(0)} />);
    expect(screen.getByText("No releases yet.")).toBeInTheDocument();
  });

  it("doesn't say 'No releases yet.' when every source failed", () => {
    render(<ChangelogFeed feed={feed(0, { failed: [pools] })} />);
    expect(screen.getByText(/Couldn't load the pools changelog/)).toBeInTheDocument();
    expect(screen.queryByText("No releases yet.")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ChangelogFeed feed={feed(6, { failed: [pools] })} />);
    await expectNoAxeViolations(container);
  });
});
