/**
 * @file src/app/terms/page.tsx
 * @desc /terms: the terms for using haruhime.moe itself, the parent site. Short, because the site
 *       is read-only: what it is, the MIT libraries, that each tool has its own terms (linked),
 *       no warranty, that the terms can change, and where to write. Headed sections in Prose,
 *       like /disclaimer. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { PageHeader, Prose, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { TERMS_UPDATED } from "@/constants/legal";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { formatIsoDate } from "@/utils/date";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/terms");

/** The live tools, each with its own terms page. */
const LIVE_TOOLS = TOOLS.filter((tool) => tool.url);

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Terms"
        meta={
          <>
            Last updated <time dateTime={TERMS_UPDATED}>{formatIsoDate(TERMS_UPDATED)}</time>
          </>
        }
      />
      <Prose className="text-sm leading-relaxed [&>section:first-child>h2]:mt-0">
        <section>
          <h2>What this site is</h2>
          <p>
            {SITE.name} is the home page for haruhime's osu! tools: it describes them, links to
            them, lists the libraries they're built from and shows their README files. It has no
            accounts and stores nothing you type. Using the site means you accept these terms.
          </p>
        </section>
        <section>
          <h2>The libraries</h2>
          <p>
            The @haruhimemoe packages shown on <TextLink href="/libraries">Libraries</TextLink> are
            released under the MIT license. Each package's license file governs its use; the docs
            pages here are a rendering of each repo's README and may lag the repo.
          </p>
        </section>
        <section>
          <h2>Each tool has its own terms</h2>
          <p>
            The tools run on their own subdomains with their own accounts and data, so each has its
            own terms, which apply there instead of these:
          </p>
          <ul>
            {LIVE_TOOLS.map((tool) => (
              <li key={tool.name}>
                <TextLink href={`${tool.url}/legal/terms`}>{tool.name} terms</TextLink>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>No warranty</h2>
          <p>
            The site and everything it links to are provided as is, without warranty of any kind.
            haruhime isn't liable for any loss that comes from using them. The site isn't affiliated
            with or endorsed by ppy Pty Ltd.
          </p>
        </section>
        <section>
          <h2>Changes</h2>
          <p>
            These terms can change. The date at the top is the last time they did, and the current
            version is always at this address.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms go to{" "}
            <TextLink href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</TextLink>.
          </p>
        </section>
      </Prose>
    </div>
  );
}
