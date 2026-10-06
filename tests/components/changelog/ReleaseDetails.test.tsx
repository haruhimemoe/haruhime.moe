/**
 * @file tests/components/changelog/ReleaseDetails.test.tsx
 * @desc ReleaseDetails: a native <details> (open or closed as asked, the anchor id on it) whose
 *       summary holds the caller's row and a hidden chevron, the notes after it; axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReleaseDetails } from "@/components/changelog/ReleaseDetails";
import { expectNoAxeViolations } from "../../helpers/axe";

describe("ReleaseDetails", () => {
  it("renders the row as the summary and the notes inside, open as asked", async () => {
    const { container } = render(
      <ReleaseDetails id="v1-0-0" open summary={<h2>1.0.0</h2>}>
        <p>notes</p>
      </ReleaseDetails>,
    );
    const details = container.querySelector("details") as HTMLDetailsElement;
    expect(details.id).toBe("v1-0-0");
    expect(details.open).toBe(true);
    const summary = details.querySelector("summary");
    expect(summary).toContainElement(screen.getByRole("heading", { level: 2, name: "1.0.0" }));
    expect(summary?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(summary?.className).toContain("cursor-pointer");
    expect(screen.getByText("notes")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("starts closed without an id when asked", () => {
    const { container } = render(
      <ReleaseDetails open={false} summary="1.0.0">
        notes
      </ReleaseDetails>,
    );
    const details = container.querySelector("details") as HTMLDetailsElement;
    expect(details.open).toBe(false);
    expect(details).not.toHaveAttribute("id");
  });
});
