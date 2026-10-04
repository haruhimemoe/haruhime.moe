/**
 * @file tests/components/changelog/ChangelogNav.test.tsx
 * @desc ChangelogNav: one nav named "Changelog filter" with every filter, and only the current
 *       one marked aria-current="page".
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChangelogNav } from "@/components/changelog/ChangelogNav";
import { CHANGELOG_FILTERS } from "@/constants/changelogs";

describe("ChangelogNav", () => {
  it("links every filter and marks only the current one", () => {
    render(<ChangelogNav current="/changelog/kind/packages" />);
    const nav = screen.getByRole("navigation", { name: "Changelog filter" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(CHANGELOG_FILTERS.map((f) => f.href));
    const current = links.filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.textContent)).toEqual(["Packages"]);
  });
});
