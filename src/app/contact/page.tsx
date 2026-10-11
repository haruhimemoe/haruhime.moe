/**
 * @file src/app/contact/page.tsx
 * @desc /contact: the email address, the Discord server, the GitHub org, and where to report a
 *       security problem. Static.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Sun Oct 11, 2026
 */

import { Card, PageHeader, TextLink } from "@haruhimemoe/ui";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { SITE } from "@/constants/site";
import { pageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = pageMetadata("/contact");

export default function ContactPage() {
  const t = useTranslations("hub.pages.contact");
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={t("contact")} lead={t("emailIsTheEasiest")} />
      <Card title={t("email")}>
        <p className="select-all font-bold text-c1">{SITE.contactEmail}</p>
        <p className="mt-2 text-sm">
          <TextLink href={`mailto:${SITE.contactEmail}`}>{t("sendAnEmail")}</TextLink>
        </p>
      </Card>
      <Card title={t("discord")}>
        <p className="text-sm">
          questions and feedback about the tools:{" "}
          <TextLink href={SITE.discordUrl}>{SITE.discordUrl.replace("https://", "")}</TextLink>
        </p>
      </Card>
      <Card title={t("github")}>
        <p className="text-sm">
          the code for every tool, plus issues and feature requests:{" "}
          <TextLink href={SITE.githubOrg}>{SITE.githubOrg.replace("https://", "")}</TextLink>
        </p>
      </Card>
      <Card title={t("security")}>
        <p className="text-sm">
          found a security problem? report it privately on GitHub (the Security tab of the tool's
          repo) or email {SITE.contactEmail}, not in a public issue. I'll reply within 7 days.
        </p>
      </Card>
    </div>
  );
}
