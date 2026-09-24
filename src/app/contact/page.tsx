/**
 * @file src/app/contact/page.tsx
 * @desc /contact: the email address, the GitHub org, and where to report a security problem.
 *       Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { linkStyles } from "@/components/ui/linkStyles";
import { PageHeader } from "@/components/ui/PageHeader";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach haruhime.moe: email, GitHub, and security reports.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Contact" lead="email is the easiest way to reach me." />
      <Card title="Email">
        <p className="select-all font-bold text-c1">{SITE.contactEmail}</p>
        <p className="mt-2 text-sm">
          <a href={`mailto:${SITE.contactEmail}`} className={linkStyles}>
            Send an email
          </a>
        </p>
      </Card>
      <Card title="GitHub">
        <p className="text-sm">
          the code for every tool, plus issues and feature requests:{" "}
          <a href={SITE.githubOrg} className={linkStyles}>
            github.com/haruhimemoe
          </a>
        </p>
      </Card>
      <Card title="Security">
        <p className="text-sm">
          found a security problem? email {SITE.contactEmail} privately instead of opening a public
          issue. I'll reply within 7 days.
        </p>
      </Card>
    </div>
  );
}
