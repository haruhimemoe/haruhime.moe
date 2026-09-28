/**
 * @file tests/components/showcase/TextDemos.test.tsx
 * @desc TextDemos: TextLink inside and off the site, and linkClasses on a download link.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextDemos } from "@/components/showcase/TextDemos";

describe("TextDemos", () => {
  it("links with TextLink inside and off the site", () => {
    render(<TextDemos />);
    expect(screen.getAllByRole("link", { name: "disclaimer" })[0]).toHaveAttribute(
      "href",
      "/disclaimer",
    );
    expect(screen.getByRole("link", { name: "source on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe/ui",
    );
    expect(screen.getByRole("link", { name: "Download the palette (JSON)" })).toHaveAttribute(
      "download",
    );
  });
});
