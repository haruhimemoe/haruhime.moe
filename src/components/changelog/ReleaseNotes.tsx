/**
 * @file src/components/changelog/ReleaseNotes.tsx
 * @desc One release's (or Unreleased's) sections: a heading per section (h3, or the level the
 *       caller passes when the release itself is an h3), written here rather than in
 *       the Markdown because mdxComponents gives Markdown headings ids and every release has an
 *       "Added"; the items render through the site's Markdown, with the file's link definitions
 *       appended so `[x]` links resolve.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import { Text } from "@haruhimemoe/ui";
import { Markdown } from "@/components/libraries/Markdown";
import { type ChangeSection, sectionMarkdown } from "@/utils/changelog";

/**
 * @function ReleaseNotes
 * @param props {{ sections: readonly ChangeSection[]; references: readonly string[]; level?: 3 | 4 }}
 *   the sections, the file's link definitions and the section heading level (default 3)
 * @returns {JSX.Element} each section's heading and list, or a line when there are none
 */
export function ReleaseNotes({
  sections,
  references,
  level = 3,
}: {
  sections: readonly ChangeSection[];
  references: readonly string[];
  level?: 3 | 4;
}) {
  const Heading = level === 4 ? "h4" : "h3";
  if (sections.length === 0) return <Text tone="muted">No notes for this release.</Text>;
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div key={section.name} className="flex flex-col gap-1">
          <Heading className="font-bold text-c1">{section.name}</Heading>
          <Markdown source={sectionMarkdown(section, references)} />
        </div>
      ))}
    </div>
  );
}
