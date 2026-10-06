/**
 * @file tests/components/app/LibraryDocsPage.test.tsx
 * @desc /libraries/[name]: prerenders every library, titles the page after the package, shows
 *       version and license, the install line with a copy button and the links, a "Libraries /
 *       <name>" trail, the library nav (All libraries first, every package with its version, the
 *       page current), renders the README with a toc of its headings, falls back to a GitHub link
 *       when the README is missing, and 404s on an unknown name.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LibraryDocsPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
  revalidate,
} from "@/app/libraries/[name]/page";
import { LIBRARIES } from "@/constants/libraries";
import { expectNoAxeViolations } from "../../helpers/axe";

const { fetchReadme, notFound, path } = vi.hoisted(() => ({
  fetchReadme: vi.fn(),
  path: { current: "/libraries/pool" },
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/libraries/stats", () => ({
  fetchLibraryStats: vi.fn(async () => ({
    version: "0.2.0",
    license: "MIT",
    downloads: 50,
    stars: 1,
    release: null,
  })),
}));
vi.mock("@/lib/libraries/readme", () => ({ fetchReadme }));
vi.mock("@/lib/libraries/npm", () => ({
  fetchNpmLatest: vi.fn(async (pkg: string) =>
    pkg === "@haruhimemoe/vcs" ? null : { version: "0.2.0", license: "MIT" },
  ),
}));
// "next/navigation" and ContentNav's "next/navigation.js" are one module, so both get every export.
vi.mock("next/navigation", () => ({ notFound, usePathname: () => path.current }));
vi.mock("next/navigation.js", () => ({ notFound, usePathname: () => path.current }));

const props = (name: string) => ({ params: Promise.resolve({ name }) }) as never;

beforeEach(() => {
  fetchReadme.mockReset();
  path.current = "/libraries/pool";
  fetchReadme.mockResolvedValue(
    "## Install\n\nAdd the package, then import.\n\n## Use `pool`\n\n[log](https://x.y)",
  );
});

describe("/libraries/[name]", () => {
  it("prerenders every library, rebuilds daily, and never serves another name", () => {
    expect(generateStaticParams()).toEqual(LIBRARIES.map((lib) => ({ name: lib.name })));
    expect(revalidate).toBe(86400);
    expect(dynamicParams).toBe(false);
  });

  it("titles the page after the package with its canonical", async () => {
    const meta = await generateMetadata(props("pool"));
    expect(meta.title).toEqual({ absolute: "@haruhimemoe/pool: docs · haruhime.moe" });
    expect(meta.alternates?.canonical).toBe("https://www.haruhime.moe/libraries/pool");
  });

  it("shows the package, version and license, the install line and the links", async () => {
    render(await LibraryDocsPage(props("pool")));
    expect(
      screen.getByRole("heading", { level: 1, name: "@haruhimemoe/pool" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Version 0.2.0, MIT")).toBeInTheDocument();
    expect(screen.getByText("bun add @haruhimemoe/pool")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy bun add @haruhimemoe/pool" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "npm" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@haruhimemoe/pool",
    );
    expect(screen.queryByRole("link", { name: "Showcase" })).toBeNull();
    for (const name of ["GitHub", "npm", "Changelog"]) {
      expect(screen.getByRole("link", { name }).className).not.toMatch(/\bz-10\b/);
    }
  });

  it("trails back to /libraries and lists every library, this one current", async () => {
    render(await LibraryDocsPage(props("pool")));
    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Libraries" })).toHaveAttribute(
      "href",
      "/libraries",
    );
    expect(within(trail).getByText("pool")).toHaveAttribute("aria-current", "page");
    const [nav] = screen.getAllByRole("navigation", { name: "Libraries" });
    const links = within(nav as HTMLElement).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/libraries",
      ...LIBRARIES.map((lib) => `/libraries/${lib.name}`),
    ]);
    expect(links[0]).toHaveTextContent("All libraries");
    expect(
      within(nav as HTMLElement).getByRole("link", { name: /^pool\s*0\.2\.0$/ }),
    ).toHaveAttribute("aria-current", "page");
    // npm failed for vcs: no badge.
    expect(within(nav as HTMLElement).getByRole("link", { name: "vcs" })).toBeInTheDocument();
  });

  it("lists the README's headings in an On this page toc", async () => {
    render(await LibraryDocsPage(props("pool")));
    const [toc] = screen.getAllByRole("navigation", { name: "On this page" });
    expect(
      within(toc as HTMLElement)
        .getAllByRole("link")
        .map((a) => [a.textContent, a.getAttribute("href")]),
    ).toEqual([
      ["Install", "#install"],
      ["Use pool", "#use-pool"],
    ]);
    expect(screen.getByRole("heading", { level: 2, name: "Use pool" })).toHaveAttribute(
      "id",
      "use-pool",
    );
  });

  it("renders the README with anchor ids", async () => {
    render(await LibraryDocsPage(props("pool")));
    expect(screen.getByRole("heading", { level: 2, name: "Install" })).toHaveAttribute(
      "id",
      "install",
    );
  });

  it("links the showcase on ui", async () => {
    render(await LibraryDocsPage(props("ui")));
    expect(screen.getByRole("link", { name: "Showcase" })).toHaveAttribute("href", "/ui");
  });

  it("points at GitHub when the README can't be fetched", async () => {
    fetchReadme.mockResolvedValue(null);
    render(await LibraryDocsPage(props("pool")));
    expect(screen.getByText(/couldn't be loaded/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "the README on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/haruhimemoe/pool",
    );
  });

  it("404s on a name that isn't a library, including prototype keys", async () => {
    for (const name of ["packs", "__proto__"]) {
      await expect(LibraryDocsPage(props(name))).rejects.toThrow("NEXT_NOT_FOUND");
    }
    const meta = await generateMetadata(props("packs"));
    expect(meta.robots).toMatchObject({ index: false });
  });

  it("has no axe violations", async () => {
    const { container } = render(await LibraryDocsPage(props("pool")));
    await expectNoAxeViolations(container);
  });
});
