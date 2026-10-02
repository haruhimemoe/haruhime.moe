/**
 * @file src/app/libraries/[name]/page.tsx
 * @desc /libraries/<name>: one package's docs, which is its README rendered from the repo's main
 *       branch, under a header with its description, version and license from npm, the install
 *       line to copy, and its links. Prerendered for the eight libraries, rebuilt once a day;
 *       any other name is a 404. When the README can't be fetched the page points at it on
 *       GitHub instead.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { notFoundMetadata, pageMetadata } from "@haruhimemoe/next-kit/seo";
import { CopyButton, PageHeader, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryLinks } from "@/components/libraries/LibraryLinks";
import { Markdown } from "@/components/libraries/Markdown";
import { findLibrary, LIBRARIES, libraryUrls } from "@/constants/libraries";
import { SEO_SITE } from "@/constants/seo";
import { fetchReadme } from "@/lib/libraries/readme";
import { fetchLibraryStats } from "@/lib/libraries/stats";

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
  const [stats, readme] = await Promise.all([fetchLibraryStats(library), fetchReadme(library)]);
  const install = `bun add ${library.pkg}`;
  const meta = [stats.version ? `Version ${stats.version}` : null, stats.license]
    .filter(Boolean)
    .join(", ");
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader title={library.pkg} lead={library.description} meta={meta || undefined} />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2">
            <code className="rounded bg-b6 px-2 py-1 text-c2 text-sm">{install}</code>
            <CopyButton text={install} label="Copy" />
          </span>
          <LibraryLinks library={library} />
        </div>
      </div>
      {readme ? (
        <Markdown source={readme} />
      ) : (
        <p className="text-c3">
          The README couldn't be loaded right now. Read{" "}
          <TextLink href={libraryUrls(library).github}>the README on GitHub</TextLink>.
        </p>
      )}
    </article>
  );
}
