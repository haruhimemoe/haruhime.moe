/**
 * @file src/components/showcase/LayoutLinkDemos.tsx
 * @desc /ui's Layout group, second half: LinkRow, SectionHeading, PrevNext, CodeChip and
 *       CopyField, then SegmentedDemo for the one client piece. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import {
  ButtonLink,
  CodeChip,
  CopyField,
  LinkRow,
  PrevNext,
  SectionHeading,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { SegmentedDemo } from "@/components/showcase/SegmentedDemo";

const SAMPLE_FILTER_ITEMS = [
  { href: "/changelog", label: "All", current: true },
  { href: "/changelog/kind/apps", label: "Apps" },
  { href: "/changelog/kind/packages", label: "Packages" },
];

/**
 * @function LayoutLinkDemos
 * @returns {JSX.Element} the rest of the Layout group's demos
 */
export function LayoutLinkDemos() {
  return (
    <>
      <Demo name="LinkRow" note="A wrapping row of text links, the current one marked.">
        <LinkRow label="Sample filter" items={SAMPLE_FILTER_ITEMS} />
      </Demo>

      <Demo
        name="SectionHeading"
        note="The h2 under a page's h1: a detail count, an anchor and actions."
      >
        <SectionHeading
          level={4}
          id="layout-sample"
          anchor
          detail="(12)"
          actions={
            <ButtonLink href="/libraries" variant="secondary">
              See all
            </ButtonLink>
          }
        >
          Sample pool
        </SectionHeading>
      </Demo>

      <Demo name="PrevNext" note="Previous and next links at the end of a page in a series.">
        <PrevNext
          label="Sample pages"
          prev={{ href: "/libraries", title: "Libraries" }}
          next={{ href: "/changelog", title: "Changelog" }}
        />
      </Demo>

      <Demo name="CodeChip" note="An inline code chip with a copy button.">
        <CodeChip code="bun add @haruhimemoe/ui" />
      </Demo>

      <Demo name="CopyField" note="A read-only field you copy from, like a pack key.">
        <CopyField label="Sample pack key" value="7f3c9a1e-sample-pack-key" />
      </Demo>

      <SegmentedDemo />
    </>
  );
}
