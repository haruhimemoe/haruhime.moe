/**
 * @file tests/components/app/LegalIndexPage.test.tsx
 * @desc /legal: its title, one h1, a link to every registered legal page with its description,
 *       and no axe violations. The [slug] pages render MDX, so their params, metadata and .md
 *       mirrors are tested in tests/unit/app/content-routes.test.ts.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LegalIndexPage, { metadata } from "@/app/legal/page";
import { CONTENT } from "@/constants/content";
import { expectNoAxeViolations } from "../../helpers/axe";

describe("/legal", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({
      absolute: "Legal: terms, privacy and disclaimers · haruhime.moe",
    });
    render(<LegalIndexPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Legal" })).toBeInTheDocument();
  });

  it("links every legal page with its description", () => {
    render(<LegalIndexPage />);
    for (const entry of CONTENT.entries.legal) {
      expect(screen.getByRole("link", { name: new RegExp(`^${entry.title}`) })).toHaveAttribute(
        "href",
        `/legal/${entry.slug}`,
      );
      expect(screen.getByText(entry.description)).toBeInTheDocument();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<LegalIndexPage />);
    await expectNoAxeViolations(container);
  });
});
