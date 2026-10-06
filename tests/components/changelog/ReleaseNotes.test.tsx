/**
 * @file tests/components/changelog/ReleaseNotes.test.tsx
 * @desc ReleaseNotes: one h3 (or h4 when asked) per section with no id (every release has an "Added"), its items as
 *       a rendered list with links resolved from the file's definitions, and a line when a
 *       release has no notes. ReleaseDate: a <time> with the ISO date, or "No date".
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReleaseDate } from "@/components/changelog/ReleaseDate";
import { ReleaseNotes } from "@/components/changelog/ReleaseNotes";

describe("ReleaseNotes", () => {
  it("renders each section as an h3 without an id and its items as a list", () => {
    render(
      <ReleaseNotes
        sections={[
          { name: "Added", items: ["`CodeBlock`", "see [docs]"] },
          { name: "Fixed", items: ["a fix"] },
        ]}
        references={["[docs]: https://x.y/docs"]}
      />,
    );
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(["Added", "Fixed"]);
    for (const heading of headings) expect(heading).not.toHaveAttribute("id");
    const lists = screen.getAllByRole("list");
    expect(within(lists[0] as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("CodeBlock").tagName).toBe("CODE");
    expect(screen.getByRole("link", { name: /docs/ })).toHaveAttribute("href", "https://x.y/docs");
  });

  it("drops the section headings to h4 under a release that is itself an h3", () => {
    render(<ReleaseNotes sections={[{ name: "Added", items: ["a"] }]} references={[]} level={4} />);
    expect(screen.getByRole("heading", { level: 4, name: "Added" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("says so when a release has no notes", () => {
    render(<ReleaseNotes sections={[]} references={[]} />);
    expect(screen.getByText("No notes for this release.")).toBeInTheDocument();
  });
});

describe("ReleaseDate", () => {
  it("renders a time element in words, or No date", () => {
    const { rerender } = render(<ReleaseDate date="2026-10-03" />);
    const time = screen.getByText("October 3, 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-10-03");
    rerender(<ReleaseDate date={null} />);
    expect(screen.getByText("No date")).toBeInTheDocument();
  });
});
