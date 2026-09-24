/**
 * @file src/app/thanks/page.tsx
 * @desc /thanks: the people and projects the tools lean on, from src/content/thanks.ts. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { Metadata } from "next";
import { linkStyles } from "@/components/ui/linkStyles";
import { PageHeader } from "@/components/ui/PageHeader";
import { THANKS } from "@/content/thanks";

export const metadata: Metadata = {
  title: "Thanks",
  description: "The people and projects the haruhime.moe tools are built on.",
  alternates: { canonical: "/thanks" },
  openGraph: { url: "/thanks" },
};

export default function ThanksPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Thanks"
        lead="these tools lean on other people's work, feedback, encouragement, and so much more. thank you."
      />
      <ul className="flex flex-col gap-3">
        {THANKS.map((entry) => (
          <li key={entry.name} className="rounded-[10px] bg-b4 p-5">
            <p className="font-bold text-c1">
              {entry.url ? (
                <a href={entry.url} className={linkStyles}>
                  {entry.name}
                </a>
              ) : (
                entry.name
              )}
            </p>
            <p className="text-sm">{entry.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
