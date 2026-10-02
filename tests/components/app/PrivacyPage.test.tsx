/**
 * @file tests/components/app/PrivacyPage.test.tsx
 * @desc /privacy: its title and one h1, the headed sections, the last-updated date, the no
 *       accounts / cookies / analytics statement, Vercel's logs, the server-side stats fetches,
 *       a link to each live tool's own policy, no axe violations.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage, { metadata } from "@/app/privacy/page";
import { PRIVACY_UPDATED } from "@/constants/legal";
import { expectNoAxeViolations } from "../../helpers/axe";

describe("/privacy", () => {
  it("has its title and one h1", () => {
    expect(metadata.title).toEqual({ absolute: "Privacy policy for haruhime.moe · haruhime.moe" });
    render(<PrivacyPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy" })).toBeInTheDocument();
  });

  it("lays out headed sections", () => {
    render(<PrivacyPage />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "What this site collects",
      "Our host",
      "Library stats",
      "Each tool has its own policy",
      "Contact",
    ]);
  });

  it("says what is and isn't collected", () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/no accounts, sets no cookies, runs no analytics/)).toBeInTheDocument();
    expect(screen.getByText(/standard request logs/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vercel's privacy policy" })).toHaveAttribute(
      "href",
      "https://vercel.com/legal/privacy-policy",
    );
    expect(screen.getByText(/your browser never contacts npm or GitHub/)).toBeInTheDocument();
  });

  it("links each live tool's own privacy policy", () => {
    render(<PrivacyPage />);
    for (const [name, host] of [
      ["packs", "https://packs.haruhime.moe"],
      ["pools", "https://pools.haruhime.moe"],
      ["bb", "https://bb.haruhime.moe"],
    ]) {
      expect(screen.getByRole("link", { name: `${name} privacy policy` })).toHaveAttribute(
        "href",
        `${host}/legal/privacy`,
      );
    }
    expect(screen.queryByRole("link", { name: /sheets/ })).toBeNull();
  });

  it("shows the last-updated date", () => {
    const { container } = render(<PrivacyPage />);
    expect(screen.getByText(/Last updated/)).toHaveTextContent("Last updated October 2, 2026");
    expect(container.querySelector("time")).toHaveAttribute("dateTime", PRIVACY_UPDATED);
  });

  it("has no axe violations", async () => {
    const { container } = render(<PrivacyPage />);
    await expectNoAxeViolations(container);
  });
});
