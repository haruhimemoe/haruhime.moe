/**
 * @file src/app/changelog/[slug]/page.tsx
 * @desc /changelog/<slug>: one repo's whole changelog, "Not released yet" first, then every
 *       release as a closable card with its own anchor (v0-9-0), only the latest open. The
 *       changelog nav on the left, a Toc of the versions on the right (wide screens), a
 *       "Changelog / <repo>" trail on top. Links the repo, its releases and the file on GitHub,
 *       and a package's library page. Prerendered for every repo, rebuilt once a day; any other
 *       slug is a 404. When the file can't be fetched the page still renders with a GitHub link.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { notFoundMetadata, pageMetadata } from "@haruhimemoe/next-kit/seo";
import { PageHeader, TextLink, Toc, type TocItem } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogFailures } from "@/components/changelog/ChangelogFailures";
import { ChangelogHistory } from "@/components/changelog/ChangelogHistory";
import { ChangelogLayout } from "@/components/changelog/ChangelogLayout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CHANGELOG_SOURCES, changelogUrls, findChangelogSource } from "@/constants/changelogs";
import { findLibrary, libraryUrls } from "@/constants/libraries";
import { SEO_SITE } from "@/constants/seo";
import { fetchAllChangelogs } from "@/lib/changelogs";
import { releaseAnchor } from "@/utils/changelog";
import { latestVersions } from "@/utils/changelog-feed";

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
  const results = await fetchAllChangelogs();
  const result = results.find((entry) => entry.source.slug === source.slug) ?? {
    source,
    error: true as const,
  };
  const urls = changelogUrls(source);
  const library = source.kind === "package" ? findLibrary(source.slug) : undefined;
  const links: readonly [string, string][] = [
    ...(library ? ([["Library page", libraryUrls(library).docs]] as [string, string][]) : []),
    ["GitHub", urls.github],
    ["Releases", urls.releases],
    ["CHANGELOG.md", urls.file],
  ];
  const toc: TocItem[] =
    "changelog" in result
      ? [
          ...(result.changelog.unreleased.length > 0
            ? [{ id: "unreleased", text: "Not released yet", depth: 2 as const }]
            : []),
          ...result.changelog.releases.map((release) => ({
            id: releaseAnchor(release.version),
            text: release.version,
            depth: 2 as const,
          })),
        ]
      : [];
  return (
    <ChangelogLayout versions={latestVersions(results)}>
      <article className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            parents={[{ href: "/changelog", label: "Changelog" }]}
            current={source.label}
          />
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_10rem] xl:gap-8">
          <div className="xl:order-2">
            <Toc items={toc} label="Versions" />
          </div>
          <div className="min-w-0">
            {"changelog" in result ? (
              <ChangelogHistory changelog={result.changelog} />
            ) : (
              <ChangelogFailures sources={[source]} />
            )}
          </div>
        </div>
      </article>
    </ChangelogLayout>
  );
}
