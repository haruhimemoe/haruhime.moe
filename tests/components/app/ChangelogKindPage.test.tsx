/**
 * @file tests/components/app/ChangelogKindPage.test.tsx
 * @desc /changelog/kind/[kind]: prerenders apps and packages only, fetches only that kind's
 *       repos, marks its filter current, titles itself, and 404s on anything else.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
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
vi.mock("next/navigation", () => ({ notFound }));

const props = (kind: string) => ({ params: Promise.resolve({ kind }) }) as never;

beforeEach(() => {
  fetchAllChangelogs.mockReset();
  fetchAllChangelogs.mockImplementation(async (sources: typeof CHANGELOG_SOURCES) =>
    sources.map((source) => ({
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

  it("fetches only the packages and marks Packages current", async () => {
    render(await ChangelogKindPage(props("packages")));
    const asked = fetchAllChangelogs.mock.calls[0]?.[0] as typeof CHANGELOG_SOURCES;
    expect(asked.every((s) => s.kind === "package")).toBe(true);
    expect(asked).toHaveLength(CHANGELOG_SOURCES.filter((s) => s.kind === "package").length);
    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog: packages" }),
    ).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Changelog filter" });
    expect(within(nav).getByRole("link", { name: "Packages" })).toHaveAttribute(
      "aria-current",
      "page",
    );
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
