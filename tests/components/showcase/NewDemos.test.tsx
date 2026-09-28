/**
 * @file tests/components/showcase/NewDemos.test.tsx
 * @desc The ui 0.5.0 demos: Tabs switching panels by arrow key, VisibilitySelect as radios and a
 *       select, CharCounter going over its limit, and ReportDisclosure thanking you after a send.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabsDemo } from "@/components/showcase/TabsDemo";
import { TextLimitDemos } from "@/components/showcase/TextLimitDemos";
import { VisibilityDemo } from "@/components/showcase/VisibilityDemo";

describe("ui 0.5.0 demos", () => {
  it("switches the Tabs panel with the arrow keys", () => {
    render(<TabsDemo />);
    expect(screen.getByRole("tabpanel", { name: "Write" })).toHaveTextContent("BBCode source");
    fireEvent.keyDown(screen.getByRole("tablist", { name: "Editor view" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Preview" })).toBeVisible();
    expect(screen.getByText(/"ui-tabs-tab-write"/)).toBeInTheDocument();
  });

  it("shows VisibilitySelect as radios and as a select with its own words", () => {
    render(<VisibilityDemo />);
    expect(screen.getByRole("radio", { name: "Unlisted" })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "Public" }));
    expect(screen.getByRole("radio", { name: "Public" })).toBeChecked();
    const select = screen.getByRole("combobox", { name: "Who can see this pool" });
    expect(select).toHaveAccessibleDescription("Only you and your editors.");
    fireEvent.change(select, { target: { value: "public" } });
    expect(select).toHaveValue("public");
  });

  it("counts past the limit, and thanks you for a report", async () => {
    render(<TextLimitDemos />);
    fireEvent.change(screen.getByRole("textbox", { name: "Post" }), {
      target: { value: "x".repeat(65) },
    });
    expect(screen.getByText("65 / 60 characters: 5 over the limit")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Report this template" }));
    fireEvent.change(screen.getByRole("textbox", { name: "What's wrong with it?" }), {
      target: { value: "spam" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send report" }));
    expect(
      await screen.findByText("Thanks. Your report was sent.", {}, { timeout: 2000 }),
    ).toBeInTheDocument();
  });
});
