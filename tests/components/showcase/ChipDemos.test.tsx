/**
 * @file tests/components/showcase/ChipDemos.test.tsx
 * @desc ChipDemos: a chip blocked with a reason stays focusable, reads its reason and doesn't
 *       toggle; ChoiceChips picks one value as native radios.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChipDemos } from "@/components/showcase/ChipDemos";

describe("ChipDemos", () => {
  it("blocks a chip with a reason, without disabling it", () => {
    render(<ChipDemos />);
    const graveyard = screen.getByRole("button", { name: "Graveyard" });
    expect(graveyard).toHaveAttribute("aria-disabled", "true");
    expect(graveyard).not.toBeDisabled();
    expect(graveyard).toHaveAccessibleDescription("This search has no graveyard maps yet.");
    fireEvent.click(graveyard);
    expect(graveyard).toHaveAttribute("aria-pressed", "false");
  });

  it("blocks FL in the mods group and leaves the picks alone", () => {
    render(<ChipDemos />);
    const fl = screen.getByRole("button", { name: "FL" });
    expect(fl).toHaveAccessibleDescription("No FL star ratings from the mirror yet.");
    fireEvent.click(fl);
    expect(screen.getByText(/^Picked: /)).not.toHaveTextContent("FL");
  });

  it("picks one order with ChoiceChips", () => {
    render(<ChipDemos />);
    const order = screen.getByRole("group", { name: "Order" });
    expect(within(order).getByRole("radio", { name: "Newest" })).toBeChecked();
    expect(within(order).getByRole("radio", { name: "Most played" })).toBeDisabled();
    fireEvent.click(within(order).getByRole("radio", { name: "Length" }));
    expect(within(order).getByRole("radio", { name: "Length" })).toBeChecked();
    expect(screen.getByText("Order: length")).toBeInTheDocument();
  });
});
