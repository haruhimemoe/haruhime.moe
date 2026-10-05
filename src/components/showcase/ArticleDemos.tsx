/**
 * @file src/components/showcase/ArticleDemos.tsx
 * @desc /ui's Articles group: the 0.17.0 article pieces. `Toc`, `Kbd` and `kbdClasses` from the
 *       root package, and from `@haruhimemoe/ui/mdx`: `Figure`, `Steps`, `Embed`, `MdxLinkCard`,
 *       `Schedule`, `Glossary` and `Term`. `ContentPage`'s new article props (authors, published,
 *       lastUpdated, readingMinutes, toc, footer) are demoed in words only, in the Content group's
 *       `ContentPage` entry: a live one would add a second h1 to this page. Every sample is
 *       labelled as sample data in its own note; none of it is this site's real content.
 *       Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { Kbd, kbdClasses, Toc, type TocItem } from "@haruhimemoe/ui";
import {
  CodeBlock,
  Embed,
  Figure,
  Glossary,
  MdxLinkCard,
  Schedule,
  Steps,
  Term,
} from "@haruhimemoe/ui/mdx";
import { Demo } from "@/components/showcase/Demo";

/** Six sample headings (h2 to h4), the shape `articleData`'s `toc` produces. */
const TOC_ITEMS: readonly TocItem[] = [
  { id: "seeding", text: "Seeding", depth: 2 },
  { id: "pools", text: "Pools", depth: 3 },
  { id: "tiebreakers", text: "Tiebreakers", depth: 2 },
  { id: "rolls", text: "Rolls", depth: 4 },
  { id: "format", text: "Format", depth: 2 },
  { id: "brackets", text: "Brackets", depth: 3 },
];

/**
 * @function ArticleDemos
 * @returns {JSX.Element} the Articles group's demos
 */
export function ArticleDemos() {
  return (
    <>
      <Demo
        name="Toc"
        note="A sample table of contents, maxDepth 4: sticky beside the page from xl up, a disclosure above it on a phone. Labelled here to tell it apart from this page's own On this page nav."
      >
        <div className="max-w-sm">
          <Toc items={TOC_ITEMS} maxDepth={4} label="Sample article contents" />
        </div>
      </Demo>
      <Demo name="Kbd" note="A keyboard key.">
        <p>
          Press <Kbd>Ctrl</Kbd>+<Kbd>K</Kbd> to open the command palette.
        </p>
      </Demo>
      <Demo name="kbdClasses" note="The class string Kbd renders, for a kbd you build yourself.">
        <CodeBlock code={kbdClasses} lang="txt" title="kbdClasses" />
        <p>
          A hand-built key: <span className={kbdClasses}>Esc</span>
        </p>
      </Demo>
      <Demo
        name="Figure"
        note="An MDX-authored figure: a sized image with a caption and credit line."
      >
        <Figure
          src="/egc/skyline-poster.webp"
          alt="The Evergreen Cup skyline banner"
          width={1920}
          height={1080}
          caption="Sample caption"
          credit="Sample credit"
        />
      </Demo>
      <Demo name="Steps" note="A numbered-rail wrapper around a plain ordered list.">
        <Steps>
          <ol>
            <li>Register a team.</li>
            <li>Submit your pool picks.</li>
            <li>Show up for your match.</li>
          </ol>
        </Steps>
      </Demo>
      <Demo
        name="Embed"
        note="A click-to-load video: nothing loads from YouTube or Twitch until the reader presses play."
      >
        <div className="flex flex-col gap-4">
          <Embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Sample YouTube video" />
          <Embed url="https://www.twitch.tv/haruhimemoe" title="Sample Twitch channel" />
        </div>
      </Demo>
      <Demo
        name="MdxLinkCard"
        note="An MDX-authored link card: a title, a description and a source line."
      >
        <MdxLinkCard
          href="https://github.com/haruhimemoe/ui"
          title="haruhimemoe/ui"
          description="The React kit this page is built from."
        />
      </Demo>
      <Demo name="Schedule" note="An ordered list of dated rows.">
        <Schedule
          items={[
            { when: "Week 1", label: "Signups open", note: "Sample row" },
            {
              when: "Oct 11, 2026",
              dateTime: "2026-10-11",
              label: "Pools lock",
              note: "Sample row",
            },
          ]}
        />
      </Demo>
      <Demo name="Glossary" note="A definition list whose entries a Term link can target by alias.">
        <Glossary
          entries={[
            { term: "FM", definition: "Free mod: any one mod allowed.", aliases: ["Freemod"] },
            { term: "NM", definition: "No mod: the base beatmap, no mods applied." },
          ]}
        />
      </Demo>
      <Demo name="Term" note="A dotted-underline link from prose to a Glossary entry.">
        <p>
          Most lobbies open with a <Term term="Freemod">freemod</Term> pick.
        </p>
      </Demo>
    </>
  );
}
