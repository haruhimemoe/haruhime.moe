/**
 * @file tests/components/showcase/ConfirmDemos.test.tsx
 * @desc ConfirmDemos: InlineConfirm moves focus to cancel and back, a confirm counts a pretend
 *       delete, AsyncButton reports success and failure, TypeToConfirm's submit stays off until
 *       the name is typed exactly, the Dialog demo opens and hands focus back, and the
 *       type-to-confirm ConfirmDialog waits for the name.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Oct 5, 2026
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConfirmDemos } from "@/components/showcase/ConfirmDemos";

describe("ConfirmDemos", () => {
  it("opens InlineConfirm on cancel and puts focus back on the trigger", () => {
    render(<ConfirmDemos />);
    fireEvent.click(screen.getByRole("button", { name: "Delete pool" }));
    expect(screen.getByRole("group", { name: "Delete this pool for good?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep it" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Keep it" }));
    expect(screen.getByRole("button", { name: "Delete pool" })).toHaveFocus();
  });

  it("counts a confirmed delete", async () => {
    render(<ConfirmDemos />);
    fireEvent.click(screen.getByRole("button", { name: "Delete pool" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete it" }));
    expect(await screen.findByText("Pretend deletes so far: 1")).toBeInTheDocument();
  });

  it("says how each AsyncButton went", async () => {
    render(<ConfirmDemos />);
    fireEvent.click(screen.getByRole("button", { name: "Update pack now" }));
    expect(await screen.findByText("Pack updated.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry sync" }));
    expect(
      await screen.findByText("The mirror didn't answer. Try again in a minute."),
    ).toBeInTheDocument();
  });

  it("keeps TypeToConfirm's submit off until the name matches", () => {
    render(<ConfirmDemos />);
    const input = screen.getByLabelText("Type Weekly pool to delete it");
    const submit = screen.getByRole("button", { name: "Delete Weekly pool" });
    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: "weekly pool" } });
    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: "Weekly pool" } });
    expect(submit).toBeEnabled();
  });

  it("opens the Dialog demo and hands focus back to its button on close", () => {
    render(<ConfirmDemos />);
    const open = screen.getByRole("button", { name: "Open a dialog" });
    open.focus();
    fireEvent.click(open);
    expect(screen.getByRole("dialog", { name: "A plain dialog" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.querySelector('dialog[aria-label="A plain dialog"]')).not.toHaveAttribute(
      "open",
    );
    expect(open).toHaveFocus();
  });

  it("waits for the name before the type-to-confirm ConfirmDialog deletes", async () => {
    render(<ConfirmDemos />);
    fireEvent.click(screen.getByRole("button", { name: "Delete Monthly pool" }));
    const dialog = screen.getByRole("alertdialog", { name: "Delete Monthly pool?" });
    const confirm = within(dialog).getByRole("button", { name: "Delete for good" });
    expect(confirm).toHaveAttribute("aria-disabled", "true");
    fireEvent.change(
      within(dialog).getByRole("textbox", { name: "Type Monthly pool to confirm" }),
      {
        target: { value: "Monthly pool" },
      },
    );
    fireEvent.click(confirm);
    expect(await screen.findByText("Pretend deletes so far: 1")).toBeInTheDocument();
  });
});
