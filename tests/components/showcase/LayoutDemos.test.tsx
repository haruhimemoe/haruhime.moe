/**
 * @file tests/components/showcase/LayoutDemos.test.tsx
 * @desc LayoutDemos: a demo for each 0.13.0 export, the SegmentedControl demo switching, and no
 *       axe violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LayoutDemos } from "@/components/showcase/LayoutDemos";
import { expectNoAxeViolations } from "../../helpers/axe";

describe("LayoutDemos", () => {
  it("shows a demo for each 0.13.0 export", () => {
    render(<LayoutDemos />);
    for (const name of [
      "Surface",
      "surfaceClasses",
      "LinkCard",
      "CardLink",
      "CardGrid",
      "StatList",
      "EmptyState",
      "Progress",
      "LinkRow",
      "SectionHeading",
      "PrevNext",
      "CodeChip",
      "CopyField",
      "SegmentedControl",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
  });

  it("switches the SegmentedControl demo", () => {
    render(<LayoutDemos />);
    fireEvent.click(screen.getByText("Grid"));
    expect(screen.getByRole("radio", { name: "Grid" })).toBeChecked();
  });

  it("has no axe violations", async () => {
    const { container } = render(<LayoutDemos />);
    await expectNoAxeViolations(container);
  });
});
