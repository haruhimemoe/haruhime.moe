/**
 * @file src/app/changelog/[slug]/page.tsx
 * @desc /changelog/<slug>: one repo's whole changelog, "Not released yet" first, then every
 *       release with its own anchor (v0-9-0). Links the repo, its releases and the file on GitHub,
 *       and a package's docs page. Prerendered for every repo, rebuilt once a day; any other slug
 *       is a 404. When the file can't be fetched the page still renders with a GitHub link.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { notFoundMetadata, pageMetadata } from "@haruhimemoe/next-kit/seo";
import { LinkRow, PageHeader, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogFailures } from "@/components/changelog/ChangelogFailures";
import { ChangelogHistory } from "@/components/changelog/ChangelogHistory";
import { CHANGELOG_SOURCES, changelogUrls, findChangelogSource } from "@/constants/changelogs";
import { findLibrary, libraryUrls } from "@/constants/libraries";
import { SEO_SITE } from "@/constants/seo";
import { fetchChangelog } from "@/lib/changelogs";
import { changelogFilterItems } from "@/utils/changelog-filters";

/** Once a day, like the changelog it reads. */
export const revalidate = 86400;

export const dynamicParams = false;

/**
 * @function generateStaticParams
 * @returns {{ slug: string }[]} every repo, so each page prerenders
 */
export function generateStaticParams() {
  return CHANGELOG_SOURCES.map((source) => ({ slug: source.slug }));
}

/**
 * @function generateMetadata
 * @param props {PageProps<"/changelog/[slug]">} the route params
 * @returns {Promise<Metadata>} the page's title, description and canonical
 */
export async function generateMetadata({
  params,
}: PageProps<"/changelog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const source = findChangelogSource(slug);
  if (!source) return notFoundMetadata(SEO_SITE, "Changelog");
  return pageMetadata(SEO_SITE, {
    path: changelogUrls(source).page,
    title: `${source.label} changelog`,
    description: `Every ${source.label} release, newest first: what was added, changed and fixed, from the repo's CHANGELOG.md.`,
  });
}

/**
 * @function RepoChangelogPage
 * @param props {PageProps<"/changelog/[slug]">} the route params
 * @returns {Promise<JSX.Element>} the repo's changelog page
 */
export default async function RepoChangelogPage({ params }: PageProps<"/changelog/[slug]">) {
  const { slug } = await params;
  const source = findChangelogSource(slug);
  if (!source) notFound();
  const result = await fetchChangelog(source);
  const urls = changelogUrls(source);
  const library = source.kind === "package" ? findLibrary(source.slug) : undefined;
  const links: readonly [string, string][] = [
    ["GitHub", urls.github],
    ["Releases", urls.releases],
    ["CHANGELOG.md", urls.file],
    ...(library ? ([["Docs", libraryUrls(library).docs]] as [string, string][]) : []),
  ];
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          title={`${source.label} changelog`}
          lead={`Every ${source.label} release, newest first.`}
        />
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {links.map(([label, href]) => (
            <li key={label}>
              <TextLink href={href} className="font-bold">
                {label}
              </TextLink>
            </li>
          ))}
        </ul>
      </div>
      <LinkRow label="Changelog filter" variant="quiet" items={changelogFilterItems(urls.page)} />
      {"changelog" in result ? (
        <ChangelogHistory changelog={result.changelog} />
      ) : (
        <ChangelogFailures sources={[source]} />
      )}
    </article>
  );
}
