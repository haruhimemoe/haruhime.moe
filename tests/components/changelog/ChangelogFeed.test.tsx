/**
 * @file tests/components/changelog/ChangelogFeed.test.tsx
 * @desc ChangelogFeed: one h2 per release linking its anchor on the repo page, the date, a
 *       Disclosure per release with a unique button name, the newest five open; the "more" line;
 *       one note per failed repo with its GitHub link; an empty feed; no duplicate ids; axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { render, screen } from "@testing-library/react";
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
      date: "2026-10-03",
      sections: [{ name: "Added" as const, items: [`item ${i}`] }],
    },
    references: [],
  })),
  more: false,
  failed: [],
  ...extra,
});

describe("ChangelogFeed", () => {
  it("titles each release with a link to its anchor and opens the newest five", () => {
    render(<ChangelogFeed feed={feed(7)} />);
    const titles = screen.getAllByRole("heading", { level: 2 });
    expect(titles).toHaveLength(7);
    expect(screen.getByRole("link", { name: "ui 0.7.0" })).toHaveAttribute(
      "href",
      "/changelog/ui#v0-7-0",
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.getAttribute("aria-expanded"))).toEqual([
      "true",
      "true",
      "true",
      "true",
      "true",
      "false",
      "false",
    ]);
    expect(screen.getByRole("button", { name: "Changes in ui 0.7.0" })).toBeInTheDocument();
    expect(new Set(buttons.map((b) => b.textContent)).size).toBe(7);
  });

  it("repeats no id across releases", () => {
    const { container } = render(<ChangelogFeed feed={feed(7)} />);
    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points at the repo pages when older releases were cut", () => {
    render(<ChangelogFeed feed={feed(1, { more: true })} />);
    expect(screen.getByText(/Older releases are on each repo's page/)).toBeInTheDocument();
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

  it("has no axe violations", async () => {
    const { container } = render(<ChangelogFeed feed={feed(6, { failed: [pools] })} />);
    await expectNoAxeViolations(container);
  });
});
