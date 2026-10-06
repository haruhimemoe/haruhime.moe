/**
 * @file tests/components/app/ChangelogKindPage.test.tsx
 * @desc /changelog/kind/[kind]: prerenders apps and packages only, shows only that kind's
 *       releases, marks its feed current in the changelog nav, a "Changelog / <kind>" trail,
 *       titles itself, and 404s on anything else.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ChangelogKindPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
  revalidate,
} from "@/app/changelog/kind/[kind]/page";
import { CHANGELOG_SOURCES } from "@/constants/changelogs";
import { expectNoAxeViolations } from "../../helpers/axe";

const { fetchAllChangelogs, notFound } = vi.hoisted(() => ({
  fetchAllChangelogs: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@/lib/changelogs", () => ({ fetchAllChangelogs }));
// "next/navigation" and ContentNav's "next/navigation.js" are one module, so one mock serves both.
vi.mock("next/navigation", () => ({ notFound, usePathname: () => "/changelog/kind/packages" }));
vi.mock("next/navigation.js", () => ({ notFound, usePathname: () => "/changelog/kind/packages" }));

const props = (kind: string) => ({ params: Promise.resolve({ kind }) }) as never;

beforeEach(() => {
  fetchAllChangelogs.mockReset();
  fetchAllChangelogs.mockImplementation(async () =>
    CHANGELOG_SOURCES.map((source) => ({
      source,
      changelog: {
        unreleased: [],
        releases: [{ version: "0.1.0", date: "2026-10-01", sections: [] }],
        references: [],
      },
    })),
  );
});

describe("/changelog/kind/[kind]", () => {
  it("prerenders apps and packages, daily, and nothing else", () => {
    expect(generateStaticParams()).toEqual([{ kind: "apps" }, { kind: "packages" }]);
    expect(revalidate).toBe(86400);
    expect(dynamicParams).toBe(false);
  });

  it("shows only the packages and marks All packages current", async () => {
    render(await ChangelogKindPage(props("packages")));
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(CHANGELOG_SOURCES.filter((s) => s.kind === "package").length);
    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog: packages" }),
    ).toBeInTheDocument();
    const [nav] = screen.getAllByRole("navigation", { name: "Changelogs" });
    expect(within(nav as HTMLElement).getByRole("link", { name: "All packages" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(trail).getByText("Packages")).toHaveAttribute("aria-current", "page");
  });

  it("has a title and canonical per kind", async () => {
    const meta = await generateMetadata(props("apps"));
    expect(meta.title).toEqual({ absolute: "Changelog: apps · haruhime.moe" });
    expect(meta.alternates?.canonical).toBe("https://www.haruhime.moe/changelog/kind/apps");
  });

  it("404s on a kind that isn't listed, including prototype keys", async () => {
    for (const kind of ["plugin", "__proto__", "toString"]) {
      await expect(ChangelogKindPage(props(kind))).rejects.toThrow("NEXT_NOT_FOUND");
    }
    expect((await generateMetadata(props("plugin"))).robots).toMatchObject({ index: false });
  });

  it("has no axe violations", async () => {
    const { container } = render(await ChangelogKindPage(props("apps")));
    await expectNoAxeViolations(container);
  });
});
