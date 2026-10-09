/**
 * @file tests/unit/app/content-routes.test.ts
 * @desc /legal: each page and its .md mirror prerender exactly the registry (unregistered slugs
 *       never build, so they 404), every registered .md answers 200 text/markdown with the
 *       entry's title as its H1 (the terms with their own text), unknown slugs answer 404, each
 *       page has its canonical URL and search title, and the rewrite maps each .md URL to its
 *       route.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { contentRewrites } from "@haruhimemoe/next-kit/docs";
import { describe, expect, it } from "vitest";
import * as md from "@/app/legal/[slug]/md/route";
import * as page from "@/app/legal/[slug]/page";
import { CONTENT } from "@/constants/content";
import nextConfig from "../../../next.config";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) }) as never;
const get = (slug: string) =>
  md.GET(new Request(`https://www.haruhime.moe/legal/${slug}.md`), params(slug));

describe("/legal", () => {
  const slugs = CONTENT.entries.legal.map((e) => ({ slug: e.slug }));

  it("prerenders exactly the registry, nothing else", () => {
    expect(page.dynamicParams).toBe(false);
    expect(page.generateStaticParams()).toEqual(slugs);
    expect(md.dynamic).toBe("force-static");
    expect(md.dynamicParams).toBe(false);
    expect(md.generateStaticParams()).toEqual(slugs);
  });

  it.each(CONTENT.entries.legal.map((e) => [e.slug, e.title] as const))(
    "serves %s.md as text/markdown",
    async (slug, title) => {
      const response = await get(slug);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toMatch(/^text\/markdown/);
      expect((await response.text()).startsWith(`# ${title}\n\n`)).toBe(true);
    },
  );

  it("serves the terms markdown at /legal/terms.md", async () => {
    const body = await (await get("terms")).text();
    expect(body).toContain("## What this site is");
    expect(body).toContain("Using the site means you accept these terms.");
    expect(body).toContain("[packs terms](https://packs.haruhime.moe/legal/terms)");
    expect(body).toContain("[Libraries](https://www.haruhime.moe/libraries)");
  });

  it.each(["__proto__", "nope", "contact"])("404s %j", async (slug) => {
    const response = await get(slug);
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found.\n");
    await expect(page.default(params(slug))).rejects.toMatchObject({
      digest: expect.stringMatching(/^NEXT_HTTP_ERROR_FALLBACK;404/),
    });
  });

  it("gives each page a canonical URL, its search title and its article date", async () => {
    await expect(page.generateMetadata(params("terms"))).resolves.toMatchObject({
      title: { absolute: "Terms of use for haruhime.moe · haruhime.moe" },
      alternates: { canonical: "https://www.haruhime.moe/legal/terms" },
      openGraph: { type: "article", modifiedTime: expect.stringContaining("2026-10-09") },
    });
  });
});

it("rewrites every .md URL to its route, after the .github banner rewrite", async () => {
  const rewrites = await nextConfig.rewrites?.();
  expect(rewrites).toMatchObject({ afterFiles: contentRewrites() });
});
