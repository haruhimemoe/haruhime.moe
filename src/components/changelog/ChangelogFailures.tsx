/**
 * @file src/components/changelog/ChangelogFailures.tsx
 * @desc One line per repo whose changelog couldn't be fetched, linking the file on GitHub, so a
 *       dead fetch reads as a gap with a way around it, not a broken page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Text, TextLink } from "@haruhimemoe/ui";
import { type ChangelogSource, changelogUrls } from "@/constants/changelogs";

/**
 * @function ChangelogFailures
 * @param props {{ sources: readonly ChangelogSource[] }} the repos that failed
 * @returns {JSX.Element | null} a line each, or nothing when none failed
 */
export function ChangelogFailures({ sources }: { sources: readonly ChangelogSource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      {sources.map((source) => (
        <Text key={source.slug} tone="muted">
          Couldn't load the {source.label} changelog right now. Read{" "}
          <TextLink href={changelogUrls(source).file}>
            the {source.label} CHANGELOG.md on GitHub
          </TextLink>
          .
        </Text>
      ))}
    </div>
  );
}
