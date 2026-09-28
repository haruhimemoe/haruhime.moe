/**
 * @file src/app/thanks/page.tsx
 * @desc /thanks: the people and projects the tools lean on, from src/content/thanks.ts. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { Card, PageHeader, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { THANKS } from "@/content/thanks";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/thanks");

export default function ThanksPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Thanks"
        lead="these tools lean on other people's work, feedback, encouragement, and so much more. thank you."
      />
      <ul className="flex flex-col gap-3">
        {THANKS.map((entry) => (
          <li key={entry.name}>
            <Card>
              <p className="font-bold text-c1">
                {entry.url ? <TextLink href={entry.url}>{entry.name}</TextLink> : entry.name}
              </p>
              <p className="text-sm">{entry.line}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
