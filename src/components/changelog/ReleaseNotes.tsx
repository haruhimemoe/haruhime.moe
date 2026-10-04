/**
 * @file src/components/changelog/ReleaseNotes.tsx
 * @desc One release's (or Unreleased's) sections: an h3 per section, written here rather than in
 *       the Markdown because mdxComponents gives Markdown headings ids and every release has an
 *       "Added"; the items render through the site's Markdown, with the file's link definitions
 *       appended so `[x]` links resolve.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Markdown } from "@/components/libraries/Markdown";
import { type ChangeSection, sectionMarkdown } from "@/utils/changelog";

/**
 * @function ReleaseNotes
 * @param props {{ sections: readonly ChangeSection[]; references: readonly string[] }} the
 *   sections and the file's link definitions
 * @returns {JSX.Element} each section's heading and list, or a line when there are none
 */
export function ReleaseNotes({
  sections,
  references,
}: {
  sections: readonly ChangeSection[];
  references: readonly string[];
}) {
  if (sections.length === 0) return <p className="text-c3 text-sm">No notes for this release.</p>;
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div key={section.name} className="flex flex-col gap-1">
          <h3 className="font-bold text-c1">{section.name}</h3>
          <Markdown source={sectionMarkdown(section, references)} />
        </div>
      ))}
    </div>
  );
}
