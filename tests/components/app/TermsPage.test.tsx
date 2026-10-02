/**
 * @file tests/components/app/TermsPage.test.tsx
 * @desc /terms: its title and one h1, the headed sections, the last-updated date, a link to each
 *       live tool's own terms and to the libraries page, the clauses that protect us, no axe
 *       violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsPage, { metadata } from "@/app/terms/page";
import { TERMS_UPDATED } from "@/constants/legal";
import { expectNoAxeViolations } from "../../helpers/axe";

describe("/terms", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({ absolute: "Terms of use for haruhime.moe · haruhime.moe" });
    render(<TermsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Terms" })).toBeInTheDocument();
  });

  it("lays out headed sections", () => {
    render(<TermsPage />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "What this site is",
      "The libraries",
      "Each tool has its own terms",
      "No warranty",
      "Changes",
      "Contact",
    ]);
  });

  it("links each live tool's own terms and the libraries page", () => {
    render(<TermsPage />);
    for (const [name, host] of [
      ["packs", "https://packs.haruhime.moe"],
      ["pools", "https://pools.haruhime.moe"],
      ["bb", "https://bb.haruhime.moe"],
    ]) {
      expect(screen.getByRole("link", { name: `${name} terms` })).toHaveAttribute(
        "href",
        `${host}/legal/terms`,
      );
    }
    expect(screen.queryByRole("link", { name: /sheets/ })).toBeNull();
    expect(screen.getByRole("link", { name: "Libraries" })).toHaveAttribute("href", "/libraries");
  });

  it("keeps the clauses that protect us", () => {
    render(<TermsPage />);
    expect(screen.getByText(/released under the MIT license/)).toBeInTheDocument();
    expect(screen.getByText(/provided as is, without warranty/)).toBeInTheDocument();
    expect(
      screen.getByText(/isn't affiliated with or endorsed by ppy Pty Ltd/),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contact@haruhime.moe" })).toHaveAttribute(
      "href",
      "mailto:contact@haruhime.moe",
    );
  });

  it("shows the last-updated date", () => {
    const { container } = render(<TermsPage />);
    expect(screen.getByText(/Last updated/)).toHaveTextContent("Last updated October 2, 2026");
    expect(container.querySelector("time")).toHaveAttribute("dateTime", TERMS_UPDATED);
  });

  it("has no axe violations", async () => {
    const { container } = render(<TermsPage />);
    await expectNoAxeViolations(container);
  });
});
