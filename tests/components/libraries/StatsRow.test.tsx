/**
 * @file tests/components/libraries/StatsRow.test.tsx
 * @desc StatsRow: four labelled stats; a failed lookup shows a dash or "no release yet".
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsRow } from "@/components/libraries/StatsRow";

describe("StatsRow", () => {
  it("labels version, downloads, stars and the latest release", () => {
    render(
      <StatsRow
        stats={{
          version: "0.6.0",
          license: "MIT",
          downloads: 1234,
          stars: 7,
          release: { tag: "v0.6.0", publishedAt: "2026-09-28T20:35:00Z" },
        }}
      />,
    );
    const terms = screen.getAllByRole("term").map((t) => t.textContent);
    expect(terms).toEqual(["Version", "Downloads / month", "Stars", "Latest release"]);
    const values = screen.getAllByRole("definition").map((d) => d.textContent);
    expect(values).toEqual(["0.6.0", "1.2k", "7", "v0.6.0, Sep 28, 2026"]);
  });

  it("shows a dash and no release yet when the lookups failed", () => {
    render(
      <StatsRow
        stats={{ version: null, license: null, downloads: null, stars: null, release: null }}
      />,
    );
    const values = screen.getAllByRole("definition").map((d) => d.textContent);
    expect(values).toEqual(["—", "—", "—", "no release yet"]);
  });
});
