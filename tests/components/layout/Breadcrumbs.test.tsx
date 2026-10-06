/**
 * @file tests/components/layout/Breadcrumbs.test.tsx
 * @desc Breadcrumbs: a "Breadcrumb" nav, each parent a link in order, the current page last as
 *       text marked current, the separators hidden from assistive tech; axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { expectNoAxeViolations } from "../../helpers/axe";

it("links each parent and marks the current page", async () => {
  const { container } = render(
    <Breadcrumbs parents={[{ href: "/libraries", label: "Libraries" }]} current="ui" />,
  );
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  const items = within(nav).getAllByRole("listitem");
  expect(items.map((li) => li.textContent)).toEqual(["Libraries/", "ui"]);
  expect(within(nav).getByRole("link", { name: "Libraries" })).toHaveAttribute(
    "href",
    "/libraries",
  );
  expect(items[1]).toHaveAttribute("aria-current", "page");
  expect(within(items[0] as HTMLElement).getByText("/")).toHaveAttribute("aria-hidden", "true");
  await expectNoAxeViolations(container);
});
