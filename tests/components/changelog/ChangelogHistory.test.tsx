/**
 * @file tests/components/changelog/ChangelogHistory.test.tsx
 * @desc ChangelogHistory: "Not released yet" first when Unreleased has entries (and absent when
 *       it doesn't), then every release as an h2 with its anchor id and date, sections open;
 *       an empty changelog says so; axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
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
  it("shows Not released yet first, then each release with its anchor", () => {
    render(<ChangelogHistory changelog={LOG} />);
    const h2 = screen.getAllByRole("heading", { level: 2 });
    expect(h2.map((h) => h.textContent)).toEqual(["Not released yet", "0.2.0", "0.1.0"]);
    expect(h2[1]).toHaveAttribute("id", "v0-2-0");
    expect(screen.getByText("coming")).toBeInTheDocument();
    expect(screen.getByText("No date")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
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
