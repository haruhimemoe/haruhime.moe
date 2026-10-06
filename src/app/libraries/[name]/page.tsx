/**
 * @file src/app/libraries/[name]/page.tsx
 * @desc /libraries/<name>: one package's docs, which is its README rendered from the repo's main
 *       branch, under a header with its description, version and license from npm, the install
 *       line to copy, and its links (its changelog page among them). Beside it, the library nav
 *       ("All libraries" first, every package with its npm version) on the left and a Toc of
 *       the README's headings on the right (wide screens); a "Libraries / <name>" trail on top.
 *       Prerendered for the nine libraries, rebuilt once a day; any other name is a 404. When
 *       the README can't be fetched the page points at it on GitHub instead.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Tue Oct 6, 2026
 */

import { notFoundMetadata, pageMetadata } from "@haruhimemoe/next-kit/seo";
import {
  CodeChip,
  ContentLayout,
  ContentNav,
  LinkRow,
  PageHeader,
  TextLink,
  Toc,
} from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Markdown } from "@/components/libraries/Markdown";
import { findLibrary, LIBRARIES, libraryLinkItems, libraryUrls } from "@/constants/libraries";
import { SEO_SITE } from "@/constants/seo";
import { fetchNpmLatest } from "@/lib/libraries/npm";
import { fetchReadme } from "@/lib/libraries/readme";
import { fetchLibraryStats } from "@/lib/libraries/stats";
import { libraryNavGroups } from "@/utils/library-nav";
import { readmeToc } from "@/utils/readme";

/** Once a day, like /libraries. */
export const revalidate = 86400;

export const dynamicParams = false;

/**
 * @function generateStaticParams
 * @returns {{ name: string }[]} every library, so each docs page prerenders
 */
export function generateStaticParams() {
  return LIBRARIES.map((library) => ({ name: library.name }));
}

/**
 * @function generateMetadata
 * @param props {PageProps<"/libraries/[name]">} the route params
 * @returns {Promise<Metadata>} the page's title, description and canonical
 */
export async function generateMetadata({
  params,
}: PageProps<"/libraries/[name]">): Promise<Metadata> {
  const { name } = await params;
  const library = findLibrary(name);
  if (!library) return notFoundMetadata(SEO_SITE, "Library");
  return pageMetadata(SEO_SITE, {
    path: libraryUrls(library).docs,
    title: `${library.pkg}: docs`,
    description: library.description,
  });
}

/**
 * @function LibraryDocsPage
 * @param props {PageProps<"/libraries/[name]">} the route params
 * @returns {Promise<JSX.Element>} the docs page
 */
export default async function LibraryDocsPage({ params }: PageProps<"/libraries/[name]">) {
  const { name } = await params;
  const library = findLibrary(name);
  if (!library) notFound();
  const [stats, readme, latest] = await Promise.all([
    fetchLibraryStats(library),
    fetchReadme(library),
    Promise.all(LIBRARIES.map((entry) => fetchNpmLatest(entry.pkg))),
  ]);
  const versions = new Map<string, string>();
  LIBRARIES.forEach((entry, i) => {
    const version = latest[i]?.version;
    if (version) versions.set(entry.name, version);
  });
  // A long README (ui's) lists its h2s only, so the column stays a map, not a second page.
  const toc = readme ? readmeToc(readme) : [];
  const install = `bun add ${library.pkg}`;
  const meta = [stats.version ? `Version ${stats.version}` : null, stats.license]
    .filter(Boolean)
    .join(", ");
  return (
    <ContentLayout
      nav={
        <ContentNav
          label="Libraries"
          indexHref="/libraries"
          indexLabel="All libraries"
          groups={libraryNavGroups(versions)}
        />
      }
    >
      <article className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            parents={[{ href: "/libraries", label: "Libraries" }]}
            current={library.name}
          />
          <PageHeader title={library.pkg} lead={library.description} meta={meta || undefined} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <CodeChip code={install} />
            <LinkRow items={libraryLinkItems(library)} />
          </div>
        </div>
        {readme ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-8">
            <div className="xl:order-2">
              <Toc
                items={toc}
                maxDepth={toc.filter((item) => item.depth <= 3).length > 30 ? 2 : 3}
              />
            </div>
            <div className="min-w-0">
              <Markdown source={readme} />
            </div>
          </div>
        ) : (
          <p className="text-c3">
            The README couldn't be loaded right now. Read{" "}
            <TextLink href={libraryUrls(library).github}>the README on GitHub</TextLink>.
          </p>
        )}
      </article>
    </ContentLayout>
  );
}
