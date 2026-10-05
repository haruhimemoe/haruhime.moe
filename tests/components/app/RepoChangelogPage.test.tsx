/**
 * @file tests/components/app/RepoChangelogPage.test.tsx
 * @desc /changelog/[slug]: prerenders every repo, titles the page after it, links GitHub, its
 *       releases, the file and (packages only) the docs page, marks the repo current in the
 *       filters, shows Not released yet and every release, still renders when the fetch fails,
 *       and 404s on an unknown slug.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RepoChangelogPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
  revalidate,
} from "@/app/changelog/[slug]/page";
import { CHANGELOG_SOURCES, type ChangelogSource } from "@/constants/changelogs";
import { expectNoAxeViolations } from "../../helpers/axe";

const { fetchChangelog, notFound } = vi.hoisted(() => ({
  fetchChangelog: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@/lib/changelogs", () => ({ fetchChangelog }));
vi.mock("next/navigation", () => ({ notFound }));

const props = (slug: string) => ({ params: Promise.resolve({ slug }) }) as never;

beforeEach(() => {
  fetchChangelog.mockReset();
  fetchChangelog.mockImplementation(async (source: ChangelogSource) => ({
    source,
    changelog: {
      unreleased: [{ name: "Fixed", items: ["soon"] }],
      releases: [
        { version: "0.9.0", date: "2026-10-03", sections: [{ name: "Added", items: ["new"] }] },
      ],
      references: [],
    },
  }));
});

describe("/changelog/[slug]", () => {
  it("prerenders every repo, daily, and nothing else", () => {
    expect(generateStaticParams()).toEqual(CHANGELOG_SOURCES.map((s) => ({ slug: s.slug })));
    expect(revalidate).toBe(86400);
    expect(dynamicParams).toBe(false);
  });

  it("titles the page after the repo with its canonical", async () => {
    const meta = await generateMetadata(props("ui"));
    expect(meta.title).toEqual({ absolute: "ui changelog · haruhime.moe" });
    expect(meta.alternates?.canonical).toBe("https://www.haruhime.moe/changelog/ui");
  });

  it("links the repo, its releases, the file and the docs page, and marks itself current", async () => {
    render(await RepoChangelogPage(props("ui")));
    expect(screen.getByRole("heading", { level: 1, name: "ui changelog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Releases" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe/ui/releases",
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/libraries/ui");
    const nav = screen.getByRole("navigation", { name: "Changelog filter" });
    expect(within(nav).getByRole("link", { name: "ui" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("heading", { level: 2, name: "Not released yet" })).toBeInTheDocument();
    const release = screen.getByRole("heading", { level: 2, name: "0.9.0" });
    expect(release).toHaveAttribute("id", "v0-9-0");
    expect(release).toHaveClass("scroll-mt-20", "font-bold", "text-c1", "text-xl");
  });

  it("has no docs link for an app", async () => {
    render(await RepoChangelogPage(props("packs")));
    expect(screen.queryByRole("link", { name: "Docs" })).toBeNull();
  });

  it("still renders with a GitHub link when the fetch fails", async () => {
    fetchChangelog.mockImplementation(async (source: ChangelogSource) => ({ source, error: true }));
    render(await RepoChangelogPage(props("pool")));
    expect(screen.getByRole("heading", { level: 1, name: "pool changelog" })).toBeInTheDocument();
    expect(screen.getByText(/Couldn't load the pool changelog/)).toBeInTheDocument();
  });

  it("404s on a slug that isn't a repo, including prototype keys", async () => {
    for (const slug of ["sheets", "__proto__"]) {
      await expect(RepoChangelogPage(props(slug))).rejects.toThrow("NEXT_NOT_FOUND");
    }
    expect((await generateMetadata(props("sheets"))).robots).toMatchObject({ index: false });
  });

  it("has no axe violations", async () => {
    const { container } = render(await RepoChangelogPage(props("ui")));
    await expectNoAxeViolations(container);
  });
});
