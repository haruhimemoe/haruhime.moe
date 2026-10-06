/**
 * @file tests/components/layout/AppPalette.test.tsx
 * @desc AppPalette: opens on Ctrl K, lists siteCommands' "Go to <page>" rows for this site's real
 *       pages, and its own Libraries / Changelog extras. CommandPalette needs next/navigation,
 *       mocked here as in ContentDemos.test.tsx.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import { CommandPaletteButton } from "@haruhimemoe/ui";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppPalette } from "@/components/layout/AppPalette";

vi.mock("next/navigation.js", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

const renderPalette = () =>
  render(
    <>
      <AppPalette />
      <CommandPaletteButton />
    </>,
  );

describe("AppPalette", () => {
  it("opens on Ctrl K and lists the site's pages and extras", () => {
    renderPalette();
    expect(screen.queryByRole("dialog", { name: "Command palette" })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });

    const dialog = screen.getByRole("dialog", { name: "Command palette" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Go to Home")).toBeInTheDocument();
    expect(screen.getByText("Go to Libraries")).toBeInTheDocument();
    expect(screen.getByText("Go to Changelog")).toBeInTheDocument();
    expect(screen.getByText("Open ui docs")).toBeInTheDocument();
    expect(screen.getByText("Open haruhime.moe changelog")).toBeInTheDocument();
  });

  it("also opens from the header's CommandPaletteButton", () => {
    renderPalette();
    fireEvent.click(screen.getByRole("button", { name: "Open command palette" }));
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
  });
});
