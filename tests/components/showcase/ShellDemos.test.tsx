/**
 * @file tests/components/showcase/ShellDemos.test.tsx
 * @desc ShellDemos: LinkTabs marks the current tab, and HeaderMenu opens its links.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShellDemos } from "@/components/showcase/ShellDemos";

describe("ShellDemos", () => {
  it("marks the current LinkTab and opens the HeaderMenu", () => {
    render(<ShellDemos />);
    const tabs = screen.getByRole("navigation", { name: "LinkTabs example" });
    expect(within(tabs).getByRole("link", { name: "Pools" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const menu = screen.getByRole("button", { name: "Account menu" });
    expect(screen.queryByRole("link", { name: "Your pools" })).not.toBeInTheDocument();
    fireEvent.click(menu);
    expect(screen.getByRole("link", { name: "Your pools" })).toBeInTheDocument();
  });
});
