/**
 * @file tests/components/layout/Header.test.tsx
 * @desc Header: the wordmark links home.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("links the wordmark home, with no nav bar", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "haruhime.moe home" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
