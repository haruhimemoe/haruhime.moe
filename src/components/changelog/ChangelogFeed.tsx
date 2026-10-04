/**
 * @file src/components/changelog/ChangelogFeed.tsx
 * @desc The /changelog feed: failures first, then each release as an h2 ("<repo> <version>",
 *       linking its anchor on the repo page) with its date and a Disclosure holding its notes.
 *       The title sits outside the Disclosure because its button can't hold a link; the button
 *       reads "Changes" plus a visually hidden release name, so each one is distinct. The newest
 *       FEED_OPEN start open. "No releases yet." only shows when there are no entries AND no
 *       failed sources; a feed where every source failed shows just the failure lines.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Disclosure, Text, TextLink } from "@haruhimemoe/ui";
import { ChangelogFailures } from "@/components/changelog/ChangelogFailures";
import { ReleaseDate } from "@/components/changelog/ReleaseDate";
import { ReleaseNotes } from "@/components/changelog/ReleaseNotes";
import { changelogUrls } from "@/constants/changelogs";
import { releaseAnchor } from "@/utils/changelog";
import { FEED_OPEN, type Feed } from "@/utils/changelog-feed";

/**
 * @function ChangelogFeed
 * @param props {{ feed: Feed }} the feed from buildFeed
 * @returns {JSX.Element} the failure notes, the releases, and a line when older ones were cut
 */
export function ChangelogFeed({ feed }: { feed: Feed }) {
  return (
    <div className="flex flex-col gap-6">
      <ChangelogFailures sources={feed.failed} />
      {feed.entries.length === 0 && feed.failed.length === 0 ? (
        <p className="text-c3">No releases yet.</p>
      ) : (
        <ol className="flex flex-col gap-6">
          {feed.entries.map(({ source, release, references }, i) => {
            const name = `${source.label} ${release.version}`;
            return (
              <li key={`${source.slug}@${release.version}`} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h2 className="font-bold text-c1 text-lg">
                    <TextLink
                      href={`${changelogUrls(source).page}#${releaseAnchor(release.version)}`}
                      variant="plain"
                    >
                      {name}
                    </TextLink>
                  </h2>
                  <ReleaseDate date={release.date} />
                </div>
                <Disclosure
                  defaultOpen={i < FEED_OPEN}
                  summary={
                    <>
                      <span aria-hidden="true">Changes</span>
                      <span className="sr-only">{`Changes in ${name}`}</span>
                    </>
                  }
                >
                  <ReleaseNotes sections={release.sections} references={references} />
                </Disclosure>
              </li>
            );
          })}
        </ol>
      )}
      {feed.more ? (
        <Text tone="muted">
          Older releases are on each repo's page, linked in the filters above.
        </Text>
      ) : null}
    </div>
  );
}
