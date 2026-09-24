/**
 * @file src/app/disclaimer/page.tsx
 * @desc /disclaimer: no ppy affiliation, the osu! API and the hinai mirror under their terms,
 *       beatmaps belong to their mappers and artists, everything provided as is. Headed sections
 *       in @haruhimemoe/ui's Prose, like packs' legal pages. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { PageHeader, Prose } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { DISCLAIMER_UPDATED } from "@/constants/legal";
import { SITE } from "@/constants/site";
import { formatIsoDate } from "@/utils/date";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "haruhime.moe isn't affiliated with osu! or ppy, and its tools are provided as is.",
  alternates: { canonical: "/disclaimer" },
  openGraph: { url: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Disclaimer"
        meta={
          <>
            Last updated{" "}
            <time dateTime={DISCLAIMER_UPDATED}>{formatIsoDate(DISCLAIMER_UPDATED)}</time>
          </>
        }
      />
      {/* Small text, the disclaimer is short. The first heading drops Prose's top margin: the
          gap under the page header already spaces it. Keep leading-relaxed after text-sm, or
          tailwind-merge drops it. */}
      <Prose className="text-sm leading-relaxed [&>section:first-child>h2]:mt-0">
        <section>
          <h2>Not affiliated</h2>
          <p>
            haruhime.moe and its tools are not affiliated with or endorsed by ppy Pty Ltd. osu! is a
            trademark of ppy Pty Ltd.
          </p>
        </section>
        <section>
          <h2>The osu! API and the hinai mirror</h2>
          <p>
            The tools use the osu! API and the hinai beatmap mirror (mirror.hinamizawa.ai), under
            each one's terms. Neither is run by me.
          </p>
        </section>
        <section>
          <h2>Beatmaps belong to their creators</h2>
          <p>
            Beatmaps belong to their mappers, and the music and art in them to their artists. The
            tools point to beatmaps; they don't host them or claim them.
          </p>
        </section>
        <section>
          <h2>Provided as is</h2>
          <p>
            Everything here is provided as is, without warranty of any kind. Use it at your own
            risk. Questions go to {SITE.contactEmail}.
          </p>
        </section>
        <section>
          <h2>Made with AI help</h2>
          <p>
            AI coding tools (Claude, Claude Code by Anthropic) were used during the making of this
            site and its child tooling.
          </p>
        </section>
      </Prose>
    </div>
  );
}
