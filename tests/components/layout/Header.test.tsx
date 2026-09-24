/**
 * @file tests/components/layout/Header.test.tsx
 * @desc Header: the wordmark links home, the three tools are centered beside it, only packs links.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("links the wordmark home", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "haruhime.moe home" })).toHaveAttribute("href", "/");
  });

  it("centers the three tools, with only packs as a link", () => {
    render(<Header />);
    const tools = screen.getByRole("navigation", { name: "Tools" });
    expect(within(tools).getByRole("link", { name: "packs" })).toHaveAttribute(
      "href",
      "https://packs.haruhime.moe",
    );
    expect(within(tools).getAllByRole("link")).toHaveLength(1);
    for (const name of ["pools", "sheets"]) {
      const item = within(tools).getByText(name).closest('[aria-disabled="true"]');
      expect(item).not.toBeNull();
      expect(item).toHaveTextContent(`${name} soon`);
    }
  });
});
