/**
 * @file src/app/changelog/kind/[kind]/page.tsx
 * @desc /changelog/kind/apps and /changelog/kind/packages: the feed for one kind of repo. A route
 *       rather than a query string so the page stays static, beside the changelog nav (which
 *       needs every repo's latest version, so every changelog is read). Prerendered for the two
 *       kinds, rebuilt once a day; anything else is a 404.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { notFoundMetadata, pageMetadata } from "@haruhimemoe/next-kit/seo";
import { PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogFeed } from "@/components/changelog/ChangelogFeed";
import { ChangelogLayout } from "@/components/changelog/ChangelogLayout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { isKindSegment, KIND_SEGMENTS } from "@/constants/changelogs";
import { SEO_SITE } from "@/constants/seo";
import { fetchAllChangelogs } from "@/lib/changelogs";
import { buildFeed, latestVersions } from "@/utils/changelog-feed";

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
  const results = await fetchAllChangelogs();
  return (
    <ChangelogLayout versions={latestVersions(results)}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            parents={[{ href: "/changelog", label: "Changelog" }]}
            current={segment.label}
          />
          <PageHeader
            title={`Changelog: ${segment.label.toLowerCase()}`}
            lead={segment.description}
          />
        </div>
        <ChangelogFeed feed={buildFeed(results, segment.kind)} />
      </div>
    </ChangelogLayout>
  );
}
