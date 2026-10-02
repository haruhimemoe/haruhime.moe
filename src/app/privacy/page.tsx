/**
 * @file src/app/privacy/page.tsx
 * @desc /privacy: the privacy policy for haruhime.moe itself, the parent site. It collects nothing
 *       of its own: no accounts, cookies or analytics. What's left is the host's request logs and
 *       the server-side fetches that fill the library stats. Each tool's own policy is linked.
 *       Headed sections in Prose, like /disclaimer. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Fri Oct 2, 2026
 * @modified Fri Oct 2, 2026
 */

import { PageHeader, Prose, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { PRIVACY_UPDATED } from "@/constants/legal";
import { SITE } from "@/constants/site";
import { TOOLS } from "@/constants/tools";
import { formatIsoDate } from "@/utils/date";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/privacy");

/** The live tools, each with its own privacy page. */
const LIVE_TOOLS = TOOLS.filter((tool) => tool.url);

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Privacy"
        meta={
          <>
            Last updated <time dateTime={PRIVACY_UPDATED}>{formatIsoDate(PRIVACY_UPDATED)}</time>
          </>
        }
      />
      <Prose className="text-sm leading-relaxed [&>section:first-child>h2]:mt-0">
        <section>
          <h2>What this site collects</h2>
          <p>
            Nothing of its own. {SITE.name} has no accounts, sets no cookies, runs no analytics and
            has no forms. Every page is static. Nothing you do here is tied to you or shared with
            anyone.
          </p>
        </section>
        <section>
          <h2>Our host</h2>
          <p>
            The site is served by Vercel, which keeps standard request logs (such as your IP
            address, browser type and the page requested) for security and operations, under{" "}
            <TextLink href="https://vercel.com/legal/privacy-policy">
              Vercel's privacy policy
            </TextLink>
            . We don't read them.
          </p>
        </section>
        <section>
          <h2>Library stats</h2>
          <p>
            The numbers on <TextLink href="/libraries">Libraries</TextLink> (versions, downloads,
            stars, releases) and each README come from npm and GitHub. Our server fetches them about
            once a day and keeps a copy; your browser never contacts npm or GitHub for them, so
            neither sees your visit.
          </p>
        </section>
        <section>
          <h2>Each tool has its own policy</h2>
          <p>
            The tools run on their own subdomains, and the ones with accounts store data there. Each
            has its own privacy policy, which applies there instead of this one:
          </p>
          <ul>
            {LIVE_TOOLS.map((tool) => (
              <li key={tool.name}>
                <TextLink href={`${tool.url}/legal/privacy`}>{tool.name} privacy policy</TextLink>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Questions about privacy go to{" "}
            <TextLink href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</TextLink>.
          </p>
        </section>
      </Prose>
    </div>
  );
}
