/**
 * @file tests/components/showcase/BasicsDemos.test.tsx
 * @desc BasicsDemos: Badge in every tone, and Disclosure closed then open.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BasicsDemos } from "@/components/showcase/BasicsDemos";

describe("BasicsDemos", () => {
  it("shows every Badge tone, and a Disclosure closed then open", () => {
    render(<BasicsDemos />);
    for (const text of ["ranked", "new", "check first", "beta"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    const closed = screen.getByRole("button", { name: "Download options" });
    expect(closed).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(closed);
    expect(closed).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Rules for this pool" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
