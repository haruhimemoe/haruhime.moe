/**
 * @file tests/components/app/NotFound.test.tsx
 * @desc 404: title, one h1, a link home.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound, { metadata } from "@/app/not-found";

describe("404", () => {
  it("has its title, one h1, and a link home", () => {
    expect(metadata.title).toBe("Page not found");
    render(<NotFound />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });
});
