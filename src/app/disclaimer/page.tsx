/**
 * @file src/app/disclaimer/page.tsx
 * @desc /disclaimer: no ppy affiliation, the osu! API and the hinai mirror under their terms,
 *       beatmaps belong to their mappers and artists, everything provided as is. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { DISCLAIMER_UPDATED } from "@/constants/legal";
import { SITE } from "@/constants/site";
import { formatIsoDate } from "@/utils/date";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "haruhime.moe isn't affiliated with osu! or ppy, and its tools are provided as is.",
  alternates: { canonical: "/disclaimer" },
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
      <Card className="flex flex-col gap-4 text-sm">
        <p>
          haruhime.moe and its tools are not affiliated with or endorsed by ppy Pty Ltd. osu! is a
          trademark of ppy Pty Ltd.
        </p>
        <p>
          The tools use the osu! API and the hinai beatmap mirror (mirror.hinamizawa.ai), under each
          one's terms. Neither is run by us.
        </p>
        <p>
          Beatmaps belong to their mappers, and the music and art in them to their artists. The
          tools point to beatmaps; they don't host them or claim them.
        </p>
        <p>
          Everything here is provided as is, without warranty of any kind. Use it at your own risk.
          Questions go to {SITE.contactEmail}.
        </p>
      </Card>
    </div>
  );
}
