/**
 * @file tests/components/changelog/ChangelogHistory.test.tsx
 * @desc ChangelogHistory: "Not released yet" first when Unreleased has entries (and absent when
 *       it doesn't), then every release as a closable <details> card with its anchor id, an h2,
 *       its date and change counts, only the latest open; an empty changelog says so; axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChangelogHistory } from "@/components/changelog/ChangelogHistory";
import type { Changelog } from "@/utils/changelog";
import { expectNoAxeViolations } from "../../helpers/axe";

const LOG: Changelog = {
  unreleased: [{ name: "Fixed", items: ["coming"] }],
  releases: [
    { version: "0.2.0", date: "2026-10-03", sections: [{ name: "Added", items: ["two"] }] },
    { version: "0.1.0", date: null, sections: [{ name: "Added", items: ["one"] }] },
  ],
  references: [],
};

describe("ChangelogHistory", () => {
  it("shows Not released yet first, then each release as a card, only the latest open", () => {
    const { container } = render(<ChangelogHistory changelog={LOG} />);
    const h2 = screen.getAllByRole("heading", { level: 2 });
    expect(h2.map((h) => h.textContent)).toEqual(["Not released yet", "0.2.0", "0.1.0"]);
    expect(screen.getByText("coming")).toBeInTheDocument();
    expect(screen.getByText("No date")).toBeInTheDocument();
    const cards = [...container.querySelectorAll("details")];
    expect(cards.map((d) => [d.id, d.open])).toEqual([
      ["v0-2-0", true],
      ["v0-1-0", false],
    ]);
    expect(cards[0]?.querySelector("summary")).toHaveTextContent("1 added");
    expect(cards[0]?.querySelector("time")).toHaveAttribute("dateTime", "2026-10-03");
    // The closed release's notes stay in the page for find in page.
    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("leaves Not released yet out when Unreleased is empty", () => {
    render(<ChangelogHistory changelog={{ ...LOG, unreleased: [] }} />);
    expect(screen.queryByText("Not released yet")).toBeNull();
  });

  it("says so when there's nothing at all", () => {
    render(<ChangelogHistory changelog={{ unreleased: [], releases: [], references: [] }} />);
    expect(screen.getByText("No releases yet.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ChangelogHistory changelog={LOG} />);
    await expectNoAxeViolations(container);
  });
});
