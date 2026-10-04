/**
 * @file tests/components/changelog/ChangelogNav.test.tsx
 * @desc ChangelogNav: one nav named "Changelog filter" with every filter, only the current one
 *       marked aria-current="page", and the current link visually distinct (underlined, text-c1)
 *       from the muted others (font-normal, text-c2).
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

  it("makes the current link look different from the others", () => {
    render(<ChangelogNav current="/changelog/kind/packages" />);
    const nav = screen.getByRole("navigation", { name: "Changelog filter" });
    const links = within(nav).getAllByRole("link");
    const current = links.find((a) => a.getAttribute("aria-current") === "page");
    const others = links.filter((a) => a.getAttribute("aria-current") !== "page");
    expect(current).toBeDefined();
    expect(current?.className).toContain("underline");
    expect(current?.className).toContain("text-c1");
    expect(others.length).toBeGreaterThan(0);
    for (const other of others) {
      expect(other.className).toContain("font-normal");
      expect(other.className).toContain("text-c2");
    }
  });
});
