/**
 * @file src/components/showcase/LayoutDemos.tsx
 * @desc /ui's Layout group, first half: Surface, surfaceClasses, LinkCard, CardLink, CardGrid,
 *       StatList, EmptyState and Progress, then LayoutLinkDemos for the rest. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import {
  CardGrid,
  CardLink,
  CodeChip,
  EmptyState,
  LinkCard,
  LinkRow,
  Progress,
  StatList,
  Surface,
  surfaceClasses,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { LayoutLinkDemos } from "@/components/showcase/LayoutLinkDemos";

const SAMPLE_LINKS = [
  { href: "/changelog/packs", label: "Changelog" },
  { href: "/legal/terms", label: "Terms" },
];

/**
 * @function LayoutDemos
 * @returns {JSX.Element} the Layout group's demos
 */
export function LayoutDemos() {
  return (
    <>
      <Demo name="Surface" note="Card's color and radius at a smaller padding: sm, md and lg.">
        <ul className="flex flex-col gap-2">
          <Surface as="li" padding="sm">
            Sample row, sm padding
          </Surface>
          <Surface as="li" padding="md">
            Sample row, md padding
          </Surface>
          <Surface as="li" padding="lg">
            Sample row, lg padding
          </Surface>
        </ul>
      </Demo>

      <Demo
        name="surfaceClasses"
        note="Surface's classes for an element Surface doesn't render, such as a next/link tile."
      >
        <a href="#layout" className={surfaceClasses({ className: "block hover:bg-b3" })}>
          Sample tile
        </a>
      </Demo>

      <Demo name="LinkCard" note="A card that is one link, with media, a link row and a code chip.">
        <LinkCard
          title="packs"
          href="https://packs.haruhime.moe"
          headingLevel={4}
          media={<div aria-hidden="true" className="h-12 bg-h2" />}
        >
          <p className="text-sm">Sample card: packs from a mappool.</p>
          <LinkRow items={SAMPLE_LINKS} />
          <CodeChip code="bun add @haruhimemoe/ui" />
        </LinkCard>
      </Demo>

      <Demo name="CardLink" note="The link that makes any relative box one click target.">
        <div className="relative rounded-[10px] border border-b4 p-4">
          <CardLink href="/relative">Sample card link</CardLink>
        </div>
      </Demo>

      <Demo name="CardGrid" note="A grid of cards as a list: one column on phones, more from sm.">
        <CardGrid columns={3}>
          <Surface>Sample card A</Surface>
          <Surface>Sample card B</Surface>
          <Surface>Sample card C</Surface>
        </CardGrid>
      </Demo>

      <Demo name="StatList" note="A label/value stat list: inline, tiles and grid.">
        <StatList
          items={[
            { label: "BPM", value: "180" },
            { label: "Stars", value: "5.21" },
          ]}
        />
        <StatList
          variant="tiles"
          items={[
            { label: "BPM", value: "180" },
            { label: "Stars", value: "5.21" },
          ]}
        />
        <StatList
          variant="grid"
          items={[
            { label: "BPM", value: "180" },
            { label: "Stars", value: "5.21" },
            { label: "Length", value: "2:08" },
            { label: "Mode", value: "osu!" },
          ]}
        />
      </Demo>

      <Demo name="EmptyState" note="Nothing here yet, dashed with a title, or filled and small.">
        <EmptyState title="No sample slots yet">Add one to get started.</EmptyState>
        <EmptyState variant="filled" size="sm">
          Nothing matches these sample filters.
        </EmptyState>
      </Demo>

      <Demo name="Progress" note="A labelled progress bar: with a status, and indeterminate.">
        <Progress label="Sample pack, 0 of 12" value={0} max={12} status="0 of 12 sets ready" />
        <Progress label="Sample pack, 5 of 12" value={5} max={12} status="5 of 12 sets ready" />
        <Progress label="Sample pack, working" status="Building the pack" />
      </Demo>

      <LayoutLinkDemos />
    </>
  );
}
