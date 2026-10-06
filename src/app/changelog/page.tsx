/**
 * @file src/app/changelog/page.tsx
 * @desc /changelog: every repo's releases in one feed, newest first, grouped by date, beside the
 *       changelog nav (All releases, Apps, Packages, Claude plugin, each repo with its latest
 *       version). Static, rebuilt once a day from each repo's CHANGELOG.md.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { ChangelogFeed } from "@/components/changelog/ChangelogFeed";
import { ChangelogLayout } from "@/components/changelog/ChangelogLayout";
import { fetchAllChangelogs } from "@/lib/changelogs";
import { buildFeed, latestVersions } from "@/utils/changelog-feed";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/changelog");

/** Once a day, like the changelogs it reads. */
export const revalidate = 86400;

export default async function ChangelogPage() {
  const results = await fetchAllChangelogs();
  return (
    <ChangelogLayout versions={latestVersions(results)}>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Changelog"
          lead="What changed in the tools, this site, the packages and the Claude plugin, newest release first."
        />
        <ChangelogFeed feed={buildFeed(results)} />
      </div>
    </ChangelogLayout>
  );
}
