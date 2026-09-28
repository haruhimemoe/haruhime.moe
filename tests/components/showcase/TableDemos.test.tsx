/**
 * @file tests/components/showcase/TableDemos.test.tsx
 * @desc TableDemos: the sample pool Table: its caption, row headers and a StarRating per row.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableDemos } from "@/components/showcase/TableDemos";

describe("TableDemos", () => {
  it("tables the first slot of each mod, with row headers", () => {
    render(<TableDemos />);
    const table = screen.getByRole("table", { name: "The sample pool's first slot of each mod" });
    const slots = within(table)
      .getAllByRole("rowheader")
      .map((th) => th.textContent);
    expect(slots).toEqual(["NM1", "HD1", "HR1", "DT1", "FM1"]);
    expect(within(table).getByText("5.21 stars")).toBeInTheDocument();
  });
});
