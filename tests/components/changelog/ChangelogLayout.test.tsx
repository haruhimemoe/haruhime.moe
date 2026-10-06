/**
 * @file tests/components/changelog/ChangelogLayout.test.tsx
 * @desc ChangelogLayout: the page beside a "Changelogs" ContentNav whose first link is All
 *       releases, then each kind's group with versions as badges; the current page marked.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { ChangelogLayout } from "@/components/changelog/ChangelogLayout";

vi.mock("next/navigation.js", () => ({ usePathname: () => "/changelog/osu" }));

it("frames the page with the changelog nav", () => {
  render(
    <ChangelogLayout versions={new Map([["osu", "1.2.0"]])}>
      <p>page</p>
    </ChangelogLayout>,
  );
  expect(screen.getByText("page")).toBeInTheDocument();
  const [nav] = screen.getAllByRole("navigation", { name: "Changelogs" });
  const links = within(nav as HTMLElement).getAllByRole("link");
  expect(links[0]).toHaveTextContent("All releases");
  expect(links[0]).toHaveAttribute("href", "/changelog");
  const osu = within(nav as HTMLElement).getByRole("link", { name: /^osu\s*1\.2\.0$/ });
  expect(osu).toHaveAttribute("aria-current", "page");
});
