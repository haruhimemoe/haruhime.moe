/**
 * @file tests/components/libraries/LibraryCard.test.tsx
 * @desc LibraryCard: one card link named after the package, its banner first, stat labels not
 *       uppercase, the install chip with no copy button, and its links lifted above the cover.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import { CardGrid } from "@haruhimemoe/ui";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LibraryCard } from "@/components/libraries/LibraryCard";
import { LIBRARIES } from "@/constants/libraries";

const STATS = {
  version: "0.6.0",
  license: "MIT",
  downloads: 1234,
  stars: 7,
  release: { tag: "v0.6.0", publishedAt: "2026-09-28T20:35:00Z" },
};

describe("LibraryCard", () => {
  it("is one card link, banner first, with no-uppercase stat labels and a copy-free chip", () => {
    const library = LIBRARIES[0];
    if (!library) throw new Error("no library fixture");
    const { container } = render(
      <CardGrid>
        <LibraryCard library={library} stats={STATS} />
      </CardGrid>,
    );
    const cardLinks = container.querySelectorAll("[data-card-link]");
    expect(cardLinks).toHaveLength(1);
    expect(cardLinks[0]).toHaveAccessibleName(library.pkg);

    const root = container.querySelector("li > div") as HTMLElement;
    expect(root.firstElementChild?.tagName).toBe("IMG");

    const terms = screen.getAllByRole("term");
    expect(terms[0]?.className).not.toMatch(/\buppercase\b/);

    expect(screen.getByText(`bun add ${library.pkg}`)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Copy/ })).toBeNull();

    for (const name of ["GitHub", "npm", "Changelog"]) {
      expect(screen.getByRole("link", { name }).className).not.toMatch(/\bz-10\b/);
    }
  });
});
