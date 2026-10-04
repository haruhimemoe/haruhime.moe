/**
 * @file src/components/showcase/TextDemos.tsx
 * @desc /ui's Text group: Text and textClasses (ToneDemos), PageHeader, TextLink in both looks
 *       and as a download, linkClasses on a button, and Prose over every element it styles.
 *       Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Sun Oct 4, 2026
 */

import { linkClasses, Prose, TextLink } from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { ToneDemos } from "@/components/showcase/ToneDemos";
import { UI_INSTALL, UI_REPO_URL } from "@/constants/showcase";

/**
 * @function TextDemos
 * @returns {JSX.Element} the tone, PageHeader, TextLink, linkClasses and Prose demos
 */
export function TextDemos() {
  return (
    <>
      <ToneDemos />

      <Demo
        name="PageHeader"
        note="The top of this page: the title in the page's one h1, a lead line with links, a meta line, and a CopyButton as the action."
      />

      <Demo
        name="TextLink"
        note="A text link. Accent (underlined pink) for running text; plain (bold, underlined on hover) for names in a list. Paths use next/link; a download is a plain link, never prefetched."
      >
        <p className="text-sm">
          Read the <TextLink href="/legal/disclaimer">disclaimer</TextLink>, or the{" "}
          <TextLink href={UI_REPO_URL}>source on GitHub</TextLink>.
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          <li>
            <TextLink href="/thanks" variant="plain">
              Thanks
            </TextLink>
          </li>
          <li>
            <TextLink href="/brand" variant="plain">
              Brand
            </TextLink>
          </li>
        </ul>
        <p className="text-sm">
          <TextLink href="/brand/haruhime-palette.json" download>
            Download the palette (JSON)
          </TextLink>
        </p>
      </Demo>

      <Demo
        name="linkClasses"
        note="The link look as a string, for an element TextLink can't be: here, a button that reads as a link."
      >
        <button type="button" className={linkClasses()}>
          Looks like a link
        </button>
      </Demo>

      <Demo
        name="Prose"
        note={
          <>
            Long-form text. The <TextLink href="/legal/disclaimer">disclaimer</TextLink> uses it
            with h2 headings.
          </>
        }
      >
        <Prose>
          <h3>A heading</h3>
          <p>
            A paragraph with <strong>bold text</strong>, <code>inline code</code> and a link to the{" "}
            <a href="/thanks">thanks page</a>.
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
            <code>{UI_INSTALL}</code>
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
    </>
  );
}
