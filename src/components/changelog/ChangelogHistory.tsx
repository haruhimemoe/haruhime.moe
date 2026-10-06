/**
 * @file src/components/changelog/ChangelogHistory.tsx
 * @desc One repo's whole changelog on /changelog/<slug>: "Not released yet" first when Unreleased
 *       has entries, then every release in file order as a closable ReleaseDetails card (anchor
 *       id v0-9-0) whose summary row holds the version as an h2, its date and a count of its
 *       changes. Only the latest starts open. Notes keep a readable measure (max-w-prose).
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { SectionHeading, Text } from "@haruhimemoe/ui";
import { ReleaseDate } from "@/components/changelog/ReleaseDate";
import { ReleaseDetails } from "@/components/changelog/ReleaseDetails";
import { ReleaseNotes } from "@/components/changelog/ReleaseNotes";
import { type Changelog, releaseAnchor, releaseSummary } from "@/utils/changelog";

/**
 * @function ChangelogHistory
 * @param props {{ changelog: Changelog }} a parsed changelog
 * @returns {JSX.Element} Unreleased and every release, or a line when there's nothing
 */
export function ChangelogHistory({ changelog }: { changelog: Changelog }) {
  const { unreleased, releases, references } = changelog;
  if (unreleased.length === 0 && releases.length === 0) {
    return <p className="text-c3">No releases yet.</p>;
  }
  return (
    <div className="flex flex-col gap-10">
      {unreleased.length > 0 ? (
        <div className="flex max-w-prose flex-col gap-3">
          <SectionHeading id="unreleased">Not released yet</SectionHeading>
          <Text tone="muted">On main, waiting for the next release.</Text>
          <ReleaseNotes sections={unreleased} references={references} />
        </div>
      ) : null}
      {releases.length > 0 ? (
        <ol className="flex flex-col gap-5">
          {releases.map((release, i) => (
            <li key={release.version}>
              <ReleaseDetails
                id={releaseAnchor(release.version)}
                open={i === 0}
                summary={
                  <>
                    <h2 className="font-bold text-c1 text-xl">{release.version}</h2>
                    <ReleaseDate date={release.date} />
                    <span className="text-c3 text-sm">{releaseSummary(release.sections)}</span>
                  </>
                }
              >
                <div className="max-w-prose">
                  <ReleaseNotes sections={release.sections} references={references} />
                </div>
              </ReleaseDetails>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
