/**
 * @file tests/components/layout/PageShell.test.tsx
 * @desc PageShell: skip link to #main, one main landmark, header and footer around the page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageShell } from "@/components/layout/PageShell";

describe("PageShell", () => {
  it("has a skip link to #main and exactly one main landmark", () => {
    render(
      <PageShell>
        <p>content</p>
      </PageShell>,
    );
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    const mains = screen.getAllByRole("main");
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute("id", "main");
  });

  it("wraps the page between the header and the footer", () => {
    render(
      <PageShell>
        <p>content</p>
      </PageShell>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
