/**
 * @file tests/components/showcase/SortableDemos.test.tsx
 * @desc /ui's Sortable demos: the sample stages reorder by keyboard, the board refuses NM1 in HD
 *       and says why, and no axe violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SortableDemos } from "@/components/showcase/SortableDemos";
import { expectNoAxeViolations } from "../../helpers/axe";

const announced = (text: string) =>
  [...document.querySelectorAll('[aria-live="assertive"]')].some((node) =>
    node.textContent?.includes(text),
  );

describe("SortableDemos", () => {
  it("reorders the sample stages by keyboard", async () => {
    const user = userEvent.setup();
    render(<SortableDemos />);
    screen.getByRole("button", { name: "Reorder Qualifiers" }).focus();
    await user.keyboard(" ");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    const stages = within(screen.getByRole("list", { name: "Sample stages" })).getAllByRole(
      "listitem",
    );
    expect(stages[0]).toHaveTextContent("Round of 16");
    expect(stages[1]).toHaveTextContent("Qualifiers");
    expect(screen.getByRole("button", { name: "Reorder Qualifiers" })).toHaveFocus();
  });

  it("refuses NM1 in HD and says why", async () => {
    const user = userEvent.setup();
    render(<SortableDemos />);
    screen.getByRole("button", { name: "Reorder NM1" }).focus();
    await user.keyboard(" ");
    await user.keyboard("{PageDown}");
    expect(announced("Can't go there: NM1 stays in NM.")).toBe(true);
    await user.keyboard("{Enter}");
    expect(announced("NM1 can't go there: NM1 stays in NM.")).toBe(true);
    await user.keyboard("{Escape}");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SortableDemos />);
    await expectNoAxeViolations(container);
  });
});
