/**
 * @file tests/components/showcase/ContentDemos.test.tsx
 * @desc /ui's Content group: the index links every legal page, the search filters them as you
 *       type, searchContent's note shows a real result, and the copy button points at the terms'
 *       .md mirror. ContentNav needs next/navigation, mocked here as in UiPage.test.tsx.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContentDemos } from "@/components/showcase/ContentDemos";

vi.mock("next/navigation.js", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/ui",
}));

describe("ContentDemos", () => {
  it("filters the legal pages as you type", () => {
    render(<ContentDemos />);
    expect(screen.getByText("3 pages.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search the legal pages"), {
      target: { value: "cookies" },
    });
    expect(screen.getByText("1 match.")).toBeInTheDocument();
  });

  it("works searchContent's sample out from the registry", () => {
    render(<ContentDemos />);
    expect(
      screen.getByText(/searchContent\(items, "ppy"\) gives Disclaimer\./),
    ).toBeInTheDocument();
  });

  it("offers the terms as Markdown", () => {
    render(<ContentDemos />);
    expect(screen.getByRole("button", { name: /Copy as Markdown/i })).toBeInTheDocument();
  });
});
