/**
 * @file src/components/changelog/ChangelogFeed.tsx
 * @desc The /changelog feed: failures first, then the releases under one h2 per date. Each
 *       release is a ReleaseDetails card whose summary row holds an h3 (the repo as a badge, then
 *       the version) and a count of its changes ("3 added, 1 fixed"); the notes and a link to the
 *       release on its repo's page sit inside. Only the newest (FEED_OPEN) starts open. "No
 *       releases yet." only shows when there are no entries AND no failed sources; a feed where
 *       every source failed shows just the failure lines.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { Badge, Text, TextLink } from "@haruhimemoe/ui";
import { ChangelogFailures } from "@/components/changelog/ChangelogFailures";
import { ReleaseDetails } from "@/components/changelog/ReleaseDetails";
import { ReleaseNotes } from "@/components/changelog/ReleaseNotes";
import { changelogUrls } from "@/constants/changelogs";
import { releaseAnchor, releaseSummary } from "@/utils/changelog";
import { FEED_OPEN, type Feed, groupByDate } from "@/utils/changelog-feed";
import { formatIsoDate } from "@/utils/date";

/**
 * @function ChangelogFeed
 * @param props {{ feed: Feed }} the feed from buildFeed
 * @returns {JSX.Element} the failure notes, the releases by date, and a line when older ones were
 *   cut
 */
export function ChangelogFeed({ feed }: { feed: Feed }) {
  let index = 0;
  return (
    <div className="flex flex-col gap-8">
      <ChangelogFailures sources={feed.failed} />
      {feed.entries.length === 0 && feed.failed.length === 0 ? (
        <p className="text-c3">No releases yet.</p>
      ) : (
        groupByDate(feed.entries).map((day) => {
          const id = `day-${day.date ?? "undated"}`;
          return (
            <section key={id} aria-labelledby={id} className="flex flex-col gap-3">
              <h2 id={id} className="font-bold text-c1 text-lg">
                {day.date ? <time dateTime={day.date}>{formatIsoDate(day.date)}</time> : "No date"}
              </h2>
              <ol className="flex flex-col gap-3">
                {day.entries.map(({ source, release, references }) => {
                  const open = index < FEED_OPEN;
                  index += 1;
                  return (
                    <li key={`${source.slug}@${release.version}`}>
                      <ReleaseDetails
                        open={open}
                        summary={
                          <>
                            <h3 className="flex items-center gap-2 font-bold text-c1">
                              <Badge>{source.label}</Badge>
                              <span>{release.version}</span>
                            </h3>
                            <span className="text-c3 text-sm">
                              {releaseSummary(release.sections)}
                            </span>
                          </>
                        }
                      >
                        <div className="flex max-w-prose flex-col gap-4">
                          <ReleaseNotes
                            sections={release.sections}
                            references={references}
                            level={4}
                          />
                          <p className="text-sm">
                            <TextLink
                              href={`${changelogUrls(source).page}#${releaseAnchor(release.version)}`}
                            >
                              {`${source.label} ${release.version} in the ${source.label} changelog`}
                            </TextLink>
                          </p>
                        </div>
                      </ReleaseDetails>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })
      )}
      {feed.more ? (
        <Text tone="muted">Older releases are on each repo's own changelog page.</Text>
      ) : null}
    </div>
  );
}
