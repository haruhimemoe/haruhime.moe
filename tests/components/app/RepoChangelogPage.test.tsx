/**
 * @file tests/components/app/RepoChangelogPage.test.tsx
 * @desc /changelog/[slug]: prerenders every repo, titles the page after it, a "Changelog / <repo>"
 *       trail, links GitHub, its releases, the file and (packages only) the library page, marks
 *       the repo current in the changelog nav, shows Not released yet and every release as a
 *       closable card (only the latest open) with a Versions toc, still renders when the fetch
 *       fails, and 404s on an unknown slug.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
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

const { fetchChangelog, notFound, path } = vi.hoisted(() => ({
  fetchChangelog: vi.fn(),
  path: { current: "/changelog/ui" },
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@/lib/changelogs", () => ({
  fetchAllChangelogs: (sources: readonly ChangelogSource[] = CHANGELOG_SOURCES) =>
    Promise.all(sources.map((source) => fetchChangelog(source))),
}));
// "next/navigation" and ContentNav's "next/navigation.js" are one module, so one mock serves both.
vi.mock("next/navigation", () => ({ notFound, usePathname: () => path.current }));
vi.mock("next/navigation.js", () => ({ notFound, usePathname: () => path.current }));

const props = (slug: string) => ({ params: Promise.resolve({ slug }) }) as never;

beforeEach(() => {
  fetchChangelog.mockReset();
  fetchChangelog.mockImplementation(async (source: ChangelogSource) => ({
    source,
    changelog: {
      unreleased: [{ name: "Fixed", items: ["soon"] }],
      releases: [
        { version: "0.9.0", date: "2026-10-03", sections: [{ name: "Added", items: ["new"] }] },
        { version: "0.8.0", date: "2026-10-01", sections: [{ name: "Fixed", items: ["old"] }] },
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

  it("links the repo, its releases, the file and the library page, and marks itself current", async () => {
    path.current = "/changelog/ui";
    render(await RepoChangelogPage(props("ui")));
    const [h1, ...extra] = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveAccessibleName("ui changelog");
    expect(extra).toHaveLength(0);
    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Changelog" })).toHaveAttribute(
      "href",
      "/changelog",
    );
    expect(within(trail).getByText("ui")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Releases" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe/ui/releases",
    );
    expect(screen.getByRole("link", { name: "Library page" })).toHaveAttribute(
      "href",
      "/libraries/ui",
    );
    const [nav] = screen.getAllByRole("navigation", { name: "Changelogs" });
    expect(
      within(nav as HTMLElement).getByRole("link", { name: /^ui\s*0\.9\.0$/ }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("heading", { level: 2, name: "Not released yet" })).toBeInTheDocument();
  });

  it("shows every release as a closable card, only the latest open, with a Versions toc", async () => {
    const { container } = render(await RepoChangelogPage(props("ui")));
    const latest = screen.getByRole("heading", { level: 2, name: "0.9.0" });
    expect(latest).toHaveClass("font-bold", "text-c1", "text-xl");
    const cards = [...container.querySelectorAll("li > details")] as HTMLDetailsElement[];
    expect(cards.map((d) => [d.id, d.open])).toEqual([
      ["v0-9-0", true],
      ["v0-8-0", false],
    ]);
    expect(cards[1]?.querySelector("summary")).toHaveTextContent(/1 fixed/);
    const [toc] = screen.getAllByRole("navigation", { name: "Versions" });
    expect(
      within(toc as HTMLElement)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href")),
    ).toEqual(["#unreleased", "#v0-9-0", "#v0-8-0"]);
  });

  it("has no library link for an app", async () => {
    path.current = "/changelog/packs";
    render(await RepoChangelogPage(props("packs")));
    expect(screen.queryByRole("link", { name: "Library page" })).toBeNull();
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
