/**
 * @file src/components/changelog/ChangelogHistory.tsx
 * @desc One repo's whole changelog on /changelog/<slug>: "Not released yet" first when Unreleased
 *       has entries, then every release in file order as an h2 with its anchor id (v0-9-0) and
 *       date, sections always open.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Text } from "@haruhimemoe/ui";
import { ReleaseDate } from "@/components/changelog/ReleaseDate";
import { ReleaseNotes } from "@/components/changelog/ReleaseNotes";
import { type Changelog, releaseAnchor } from "@/utils/changelog";

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
        <div className="flex flex-col gap-3">
          <h2 id="unreleased" className="scroll-mt-20 font-bold text-c1 text-xl">
            Not released yet
          </h2>
          <Text tone="muted">On main, waiting for the next release.</Text>
          <ReleaseNotes sections={unreleased} references={references} />
        </div>
      ) : null}
      {releases.map((release) => (
        <div key={release.version} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h2
              id={releaseAnchor(release.version)}
              className="scroll-mt-20 font-bold text-c1 text-xl"
            >
              {release.version}
            </h2>
            <ReleaseDate date={release.date} />
          </div>
          <ReleaseNotes sections={release.sections} references={references} />
        </div>
      ))}
    </div>
  );
}
