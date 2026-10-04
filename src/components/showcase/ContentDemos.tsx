/**
 * @file src/components/showcase/ContentDemos.tsx
 * @desc /ui's Content group: the docs, guides and legal kit, shown on this site's own legal pages
 *       (ContentIndex, ContentSearch and searchContent over the registry's entries, a
 *       CopyMarkdownButton for the terms' .md mirror, a BrandSwatch), and a note for the frames
 *       /legal and /brand already use (ContentLayout, ContentNav, ContentPage, BrandPage), whose
 *       own h1 and landmarks can't sit inside this page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { palette } from "@haruhimemoe/brand/palette";
import {
  BrandSwatch,
  ContentIndex,
  ContentSearch,
  CopyMarkdownButton,
  searchContent,
  TextLink,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { CONTENT } from "@/constants/content";
import { toNavItem } from "@/utils/content-nav";

const ITEMS = CONTENT.entries.legal.map(toNavItem("legal"));

/** searchContent's result for a sample query, worked out at render. */
const SAMPLE = searchContent(ITEMS, "ppy")
  .map((item) => item.title)
  .join(", ");

/**
 * @function ContentDemos
 * @returns {JSX.Element} the Content group's demos
 */
export function ContentDemos() {
  return (
    <>
      <Demo
        name="ContentLayout"
        note={
          <>
            A section's frame: its nav beside the page, stacked on a phone. Live on{" "}
            <TextLink href="/legal">/legal</TextLink>.
          </>
        }
      />
      <Demo
        name="ContentNav"
        note="The section nav: the index link, then each group's pages, the current one marked. It frames /legal."
      />
      <Demo
        name="ContentPage"
        note="One content page: its h1, description, last update, a Copy as Markdown button and the MDX body. Every /legal/<slug> page is one."
      />
      <Demo name="ContentIndex" note="A section's pages as cards, each with its description.">
        <ContentIndex items={ITEMS} />
      </Demo>
      <Demo
        name="ContentSearch"
        note="A search box over a section's pages, with a live count. Type to filter."
      >
        <ContentSearch items={ITEMS} label="Search the legal pages" />
      </Demo>
      <Demo
        name="searchContent"
        note={`The filter ContentSearch runs: searchContent(items, "ppy") gives ${SAMPLE}.`}
      />
      <Demo
        name="CopyMarkdownButton"
        note="Fetches a page's .md mirror and copies it, then says whether it worked."
      >
        <CopyMarkdownButton href="/legal/terms.md" />
      </Demo>
      <Demo
        name="BrandPage"
        note={
          <>
            A product's whole brand page from brandPageData, with slots for extra sections. Live on{" "}
            <TextLink href="/brand">/brand</TextLink>.
          </>
        }
      />
      <Demo name="BrandSwatch" note="One palette token: press it to copy the hex.">
        <div className="max-w-56">
          <BrandSwatch token="h1" hex={palette(333).h1} />
        </div>
      </Demo>
    </>
  );
}
