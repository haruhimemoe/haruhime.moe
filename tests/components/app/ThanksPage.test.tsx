/**
 * @file tests/components/app/ThanksPage.test.tsx
 * @desc /thanks: title, one h1, every entry from the thanks list.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThanksPage, { metadata } from "@/app/thanks/page";
import { THANKS } from "@/content/thanks";

describe("/thanks", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toBe("Thanks");
    render(<ThanksPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Thanks" })).toBeInTheDocument();
  });

  it("lists every entry, linked when it has a URL", () => {
    render(<ThanksPage />);
    for (const entry of THANKS) {
      expect(screen.getByText(entry.line)).toBeInTheDocument();
      if (entry.url) {
        expect(screen.getByRole("link", { name: entry.name })).toHaveAttribute("href", entry.url);
      } else {
        expect(screen.getByText(entry.name)).toBeInTheDocument();
      }
    }
  });
});
