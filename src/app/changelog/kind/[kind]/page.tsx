/**
 * @file src/app/changelog/kind/[kind]/page.tsx
 * @desc /changelog/kind/apps and /changelog/kind/packages: the feed for one kind of repo. A route
 *       rather than a query string so the page stays static. Prerendered for the two kinds,
 *       rebuilt once a day; anything else is a 404.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { notFoundMetadata, pageMetadata } from "@haruhimemoe/next-kit/seo";
import { LinkRow, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogFeed } from "@/components/changelog/ChangelogFeed";
import { CHANGELOG_SOURCES, isKindSegment, KIND_SEGMENTS } from "@/constants/changelogs";
import { SEO_SITE } from "@/constants/seo";
import { fetchAllChangelogs } from "@/lib/changelogs";
import { buildFeed } from "@/utils/changelog-feed";
import { changelogFilterItems } from "@/utils/changelog-filters";

/** Once a day, like the changelogs it reads. */
export const revalidate = 86400;

export const dynamicParams = false;

/**
 * @function generateStaticParams
 * @returns {{ kind: string }[]} each kind segment, so both feeds prerender
 */
export function generateStaticParams() {
  return Object.keys(KIND_SEGMENTS).map((kind) => ({ kind }));
}

/**
 * @function generateMetadata
 * @param props {PageProps<"/changelog/kind/[kind]">} the route params
 * @returns {Promise<Metadata>} the feed's title, description and canonical
 */
export async function generateMetadata({
  params,
}: PageProps<"/changelog/kind/[kind]">): Promise<Metadata> {
  const { kind } = await params;
  if (!isKindSegment(kind)) return notFoundMetadata(SEO_SITE, "Changelog");
  const segment = KIND_SEGMENTS[kind];
  return pageMetadata(SEO_SITE, {
    path: `/changelog/kind/${kind}`,
    title: `Changelog: ${segment.label.toLowerCase()}`,
    description: segment.description,
  });
}

/**
 * @function ChangelogKindPage
 * @param props {PageProps<"/changelog/kind/[kind]">} the route params
 * @returns {Promise<JSX.Element>} the feed for that kind
 */
export default async function ChangelogKindPage({ params }: PageProps<"/changelog/kind/[kind]">) {
  const { kind } = await params;
  if (!isKindSegment(kind)) notFound();
  const segment = KIND_SEGMENTS[kind];
  const sources = CHANGELOG_SOURCES.filter((source) => source.kind === segment.kind);
  const feed = buildFeed(await fetchAllChangelogs(sources), segment.kind);
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={`Changelog: ${segment.label.toLowerCase()}`} lead={segment.description} />
      <LinkRow
        label="Changelog filter"
        variant="quiet"
        items={changelogFilterItems(`/changelog/kind/${kind}`)}
      />
      <ChangelogFeed feed={feed} />
    </div>
  );
}
