/**
 * @file src/app/ui/page.tsx
 * @desc /ui: every component @haruhimemoe/ui exports, rendered from the installed package in its
 *       states, grouped like the package README (basics, forms, actions, icons, filters, shell).
 *       The page's own header, frame and footer are the PageHeader and shell examples. Static;
 *       the filter demos are one small client component.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Fri Sep 25, 2026
 */

import {
  Button,
  ButtonLink,
  buttonClasses,
  Card,
  Checkbox,
  CopyButton,
  DiscordIcon,
  fieldClasses,
  GitHubIcon,
  HaruhimeWordmark,
  HaruhimeWordmarkLink,
  JsonLd,
  NavLinks,
  Notice,
  PageHeader,
  Pagination,
  Prose,
  Select,
  Textarea,
  TextInput,
} from "@haruhimemoe/ui";
import uiPackage from "@haruhimemoe/ui/package.json" with { type: "json" };
import type { Metadata } from "next";
import { Demo } from "@/components/showcase/Demo";
import { DemoGroup } from "@/components/showcase/DemoGroup";
import { FilterDemos } from "@/components/showcase/FilterDemos";
import { linkStyles } from "@/components/ui/linkStyles";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "UI",
  description:
    "Every @haruhimemoe/ui component in its states: buttons, cards, form fields, filters and the site shell.",
  alternates: { canonical: "/ui" },
  openGraph: { url: "/ui" },
};

const REPO_URL = "https://github.com/haruhimemoe/ui";
const NPM_URL = "https://www.npmjs.com/package/@haruhimemoe/ui";
const INSTALL = "bun add @haruhimemoe/ui";

/** The groups, in page order: anchor id and heading. */
const GROUPS = [
  { id: "basics", title: "Basics" },
  { id: "forms", title: "Forms" },
  { id: "actions", title: "Actions" },
  { id: "icons", title: "Icons" },
  { id: "filters", title: "Filters" },
  { id: "shell", title: "Shell" },
] as const;

/** Pagination examples link back here; the page ignores the query. */
const pageHref = (page: number): string => `/ui?page=${page}#actions`;

export default function UiPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="UI"
          lead={
            <>
              Every component in{" "}
              <a href={NPM_URL} className={linkStyles}>
                @haruhimemoe/ui
              </a>
              , rendered from the package itself. haruhime.moe, packs and pools are built from it.
              The source is on{" "}
              <a href={REPO_URL} className={linkStyles}>
                GitHub
              </a>
              .
            </>
          }
          meta={`Version ${uiPackage.version}, MIT license. Install: ${INSTALL}`}
          actions={<CopyButton text={INSTALL} label="Copy install command" />}
        />
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 font-bold text-sm">
            {GROUPS.map((group) => (
              <li key={group.id}>
                <a href={`#${group.id}`} className="text-c3 transition-colors hover:text-c1">
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <DemoGroup id="basics" title="Basics">
        <Demo name="Button" note="Primary, secondary and ghost, at md and lg, then disabled.">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="lg">Primary</Button>
            <Button variant="secondary" size="lg">
              Secondary
            </Button>
            <Button variant="ghost" size="lg">
              Ghost
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button disabled>Primary</Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="ghost" disabled>
              Ghost
            </Button>
          </div>
        </Demo>

        <Demo
          name="ButtonLink"
          note="A link that looks like a button. Paths use next/link; a URL with a scheme is a plain link."
        >
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/brand">Brand page</ButtonLink>
            <ButtonLink href={REPO_URL} variant="secondary" target="_blank">
              Source on GitHub (new tab)
            </ButtonLink>
            <ButtonLink href="/" variant="ghost" size="lg">
              Home
            </ButtonLink>
          </div>
        </Demo>

        <Demo
          name="buttonClasses"
          note="The button classes as a string, for elements the components don't cover. Here, a summary."
        >
          <details>
            <summary className={buttonClasses({ variant: "secondary", className: "w-fit" })}>
              More
            </summary>
            <p className="mt-3 text-sm">It opens like any details element.</p>
          </details>
        </Demo>

        <Demo
          name="Card"
          note="The panel, without and with a title. A title makes it a region. Its heading is an h2 unless headingLevel says otherwise."
        >
          <Card>A card without a title. Just a rounded b4 panel.</Card>
          <Card title="A card with a title" headingLevel={4}>
            <p className="text-sm">
              The title names the card. It's an h4 here (headingLevel 4), under this demo's h3.
            </p>
          </Card>
        </Demo>

        <Demo
          name="PageHeader"
          note="The top of this page: the title in the page's one h1, a lead line with links, a meta line, and a CopyButton as the action."
        />

        <Demo name="Notice" note="Short status text in each tone, then an error list as a div.">
          <Notice>Info: the pack is saved in this browser.</Notice>
          <Notice tone="warning">Warning: two maps in this pool are loved, not ranked.</Notice>
          <Notice tone="error">Error: that beatmap set doesn't exist.</Notice>
          <Notice tone="error" as="div">
            <p>Two maps couldn't be added:</p>
            <ul className="list-disc pl-5">
              <li>1234567 isn't a beatmap id.</li>
              <li>7654321 is already in the pack.</li>
            </ul>
          </Notice>
        </Demo>

        <Demo
          name="Prose"
          note={
            <>
              Long-form text. The{" "}
              <a href="/disclaimer" className={linkStyles}>
                disclaimer
              </a>{" "}
              uses it with h2 headings.
            </>
          }
        >
          <Prose>
            <h3>A heading</h3>
            <p>
              A paragraph with <strong>bold text</strong>, <code>inline code</code> and a link to
              the <a href="/thanks">thanks page</a>.
            </p>
            <ul>
              <li>A list item</li>
              <li>Another one</li>
            </ul>
            <ol>
              <li>First</li>
              <li>Second</li>
            </ol>
            <pre>
              <code>{INSTALL}</code>
            </pre>
            <hr />
            <table>
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Stars</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NM1</td>
                  <td>5.21</td>
                </tr>
                <tr>
                  <td>DT1</td>
                  <td>6.05</td>
                </tr>
              </tbody>
            </table>
          </Prose>
        </Demo>
      </DemoGroup>

      <DemoGroup id="forms" title="Forms">
        <Demo name="TextInput" note="With a hint, then with a hint and an error.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              id="ui-name"
              label="Pack name"
              hint="Shown on the pack page."
              placeholder="Weekly pool"
            />
            <TextInput
              id="ui-link"
              label="Link name"
              hint="Letters, numbers and dashes."
              defaultValue="my pack!"
              error="Use letters, numbers and dashes only."
            />
          </div>
        </Demo>

        <Demo name="Textarea" note="With a hint, then with a hint and an error.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Textarea id="ui-notes" label="Notes" hint="Anyone with the link can read these." />
            <Textarea
              id="ui-ids"
              label="Beatmap ids"
              hint="One per line."
              defaultValue="abc"
              error="abc isn't a beatmap id."
            />
          </div>
        </Demo>

        <Demo name="Select" note="With a hint, then with a hint and an error.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select id="ui-mode" label="Game mode" hint="Which ruleset the pool is for.">
              <option value="osu">osu!</option>
              <option value="taiko">taiko</option>
              <option value="fruits">catch</option>
              <option value="mania">mania</option>
            </Select>
            <Select
              id="ui-sort"
              label="Sort by"
              hint="How the list is ordered."
              defaultValue=""
              error="Pick an order."
            >
              <option value="">Choose one</option>
              <option value="stars">Star rating</option>
              <option value="length">Length</option>
            </Select>
          </div>
        </Demo>

        <Demo name="Checkbox" note="With a hint, then with a hint and an error.">
          <Checkbox
            id="ui-public"
            label="Public"
            hint="Anyone with the link can see it."
            defaultChecked
          />
          <Checkbox
            id="ui-rules"
            label="I read the rules"
            hint="The mappool rules for this tournament."
            error="Check this box to go on."
          />
        </Demo>

        <Demo
          name="fieldClasses"
          note="The field look as a string, for a bare control that labels itself."
        >
          <select aria-label="Move to" defaultValue="nm" className={fieldClasses("w-auto")}>
            <option value="nm">Move to NM</option>
            <option value="hd">Move to HD</option>
            <option value="dt">Move to DT</option>
          </select>
        </Demo>
      </DemoGroup>

      <DemoGroup id="actions" title="Actions">
        <Demo
          name="CopyButton"
          note="Copies text and says so beside the button. The default, then a primary one with its own label and message."
        >
          <CopyButton text={INSTALL} />
          <CopyButton
            text={`${SITE.url}/ui`}
            label="Copy this page's link"
            copiedMessage="Link copied."
            variant="primary"
          />
        </Demo>

        <Demo
          name="Pagination"
          note="Previous and next around the page count: on the first page, a middle one, and the last."
        >
          <Pagination
            aria-label="Pages, first page example"
            page={1}
            pageCount={5}
            hrefFor={pageHref}
          />
          <Pagination
            aria-label="Pages, middle page example"
            page={3}
            pageCount={5}
            hrefFor={pageHref}
          />
          <Pagination
            aria-label="Pages, last page example"
            page={5}
            pageCount={5}
            hrefFor={pageHref}
          />
        </Demo>

        <Demo
          name="JsonLd"
          note="schema.org data in a script tag, so nothing shows. This page carries one describing the package; view the page source to see it."
        />
        <JsonLd
          data={{
            "@type": "SoftwareSourceCode",
            name: "@haruhimemoe/ui",
            description: "React components for the haruhime.moe osu! tools on Next.js.",
            codeRepository: REPO_URL,
            url: NPM_URL,
            version: uiPackage.version,
            programmingLanguage: "TypeScript",
            license: "https://opensource.org/licenses/MIT",
            author: { "@id": `${SITE.url}/#person` },
          }}
        />
      </DemoGroup>

      <DemoGroup id="icons" title="Icons">
        <Demo
          name="DiscordIcon"
          note="The Discord logo in the text color, kept white here (one of the colors Discord's brand guidelines allow), at the default size and larger. Screen readers skip it, so the link around it carries the name."
        >
          <div className="flex flex-wrap items-center gap-4 text-c1">
            <DiscordIcon />
            <DiscordIcon className="size-8" />
            <a
              href={SITE.discordUrl}
              aria-label="haruhime.moe on Discord"
              className="transition-opacity hover:opacity-80"
            >
              <DiscordIcon className="size-8" />
            </a>
          </div>
        </Demo>

        <Demo
          name="GitHubIcon"
          note="The GitHub mark in the text color, at the default size and larger. Screen readers skip it, so the link around it carries the name."
        >
          <div className="flex flex-wrap items-center gap-4 text-c2">
            <GitHubIcon />
            <GitHubIcon className="size-8" />
            <a
              href={REPO_URL}
              aria-label="@haruhimemoe/ui on GitHub"
              className="text-c3 transition-colors hover:text-c1"
            >
              <GitHubIcon className="size-8" />
            </a>
          </div>
        </Demo>

        <Demo
          name="HaruhimeWordmark"
          note="The wordmark as inline SVG, in the brand's own colors, at the default size and larger."
        >
          <div className="flex flex-wrap items-end gap-6">
            <HaruhimeWordmark />
            <HaruhimeWordmark className="h-12 w-auto" />
          </div>
        </Demo>

        <Demo
          name="HaruhimeWordmarkLink"
          note="The wordmark linking to haruhime.moe, dimmed until hovered. The tool sites put it in their footer."
        >
          <HaruhimeWordmarkLink />
        </Demo>
      </DemoGroup>

      <DemoGroup id="filters" title="Filters">
        <FilterDemos />
      </DemoGroup>

      <DemoGroup id="shell" title="Shell">
        <Demo
          name="SiteHeader"
          note="The bar at the top of this page. The brand slot is the wordmark linking home, and the links are the tools, centered (navAlign center) in a nav named Tools. Tools that haven't launched show as text marked soon."
        />
        <Demo
          name="NavLinks"
          note="The link list inside SiteHeader. The current page's link gets aria-current and lights up: here, UI."
        >
          <nav aria-label="NavLinks example">
            <NavLinks
              links={[
                { label: "Home", href: "/" },
                { label: "UI", href: "/ui" },
                { label: "Brand", href: "/brand" },
                { label: "sheets", note: "soon" },
              ]}
            />
          </nav>
        </Demo>
        <Demo
          name="SiteFooter"
          note="The footer below: the Tools, haruhime.moe and Legal columns, the trademark line as fine print, and the Discord and GitHub icon links. The tool sites also show the haruhime.moe wordmark there; this site turns it off, since it is haruhime.moe."
        />
        <Demo
          name="PageShell"
          note="The frame around this page: a skip link (press Tab on a fresh load), the header, the main content and the footer, which stays at the bottom on short pages."
        />
      </DemoGroup>
    </div>
  );
}
