/**
 * @file tests/components/app/LibraryDocsPage.test.tsx
 * @desc /libraries/[name]: prerenders every library, titles the page after the package, shows
 *       version and license, the install line with a copy button and the links, renders the
 *       README, falls back to a GitHub link when the README is missing, and 404s on an unknown
 *       name.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LibraryDocsPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
  revalidate,
} from "@/app/libraries/[name]/page";
import { LIBRARIES } from "@/constants/libraries";
import { expectNoAxeViolations } from "../../helpers/axe";

const { fetchReadme, notFound } = vi.hoisted(() => ({
  fetchReadme: vi.fn(),
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
vi.mock("next/navigation", () => ({ notFound }));

const props = (name: string) => ({ params: Promise.resolve({ name }) }) as never;

beforeEach(() => {
  fetchReadme.mockReset();
  fetchReadme.mockResolvedValue(
    "## Install\n\nAdd the package, then import.\n\n[log](https://x.y)",
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
    expect(screen.getByRole("button", { name: "Copy install" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "npm" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@haruhimemoe/pool",
    );
    expect(screen.queryByRole("link", { name: "Showcase" })).toBeNull();
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
