/**
 * @file src/app/not-found.tsx
 * @desc 404 page: a short message and a link home.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { ButtonLink, PageHeader } from "@haruhimemoe/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <PageHeader
      title="Page not found"
      lead="That page doesn't exist, or it moved."
      actions={
        <ButtonLink href="/" variant="secondary">
          Back home
        </ButtonLink>
      }
    />
  );
}
