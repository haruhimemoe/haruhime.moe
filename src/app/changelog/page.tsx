/**
 * @file src/app/changelog/page.tsx
 * @desc /changelog: every repo's releases in one feed, newest first, under the filter links (All,
 *       Apps, Packages, each repo). Static, rebuilt once a day from each repo's CHANGELOG.md.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Mon Oct 5, 2026
 */

import { LinkRow, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { ChangelogFeed } from "@/components/changelog/ChangelogFeed";
import { fetchAllChangelogs } from "@/lib/changelogs";
import { buildFeed } from "@/utils/changelog-feed";
import { changelogFilterItems } from "@/utils/changelog-filters";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/changelog");

/** Once a day, like the changelogs it reads. */
export const revalidate = 86400;

export default async function ChangelogPage() {
  const feed = buildFeed(await fetchAllChangelogs());
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Changelog"
        lead="What changed in the tools, this site, the packages and the Claude plugin, newest release first."
      />
      <LinkRow
        label="Changelog filter"
        variant="quiet"
        items={changelogFilterItems("/changelog")}
      />
      <ChangelogFeed feed={feed} />
    </div>
  );
}
