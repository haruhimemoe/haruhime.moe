/**
 * @file src/mdx-components.tsx
 * @desc Global MDX element overrides (required by @next/mdx in the App Router): shared
 *       @haruhimemoe/ui element overrides (links, heading anchors, callouts, tables, highlighted
 *       code blocks), the same as packs. Registers Shiki highlighting as a side effect, for any
 *       fenced code block a content page adds. Also registers the seven next-kit legal blocks,
 *       each bound to this site's LEGAL_SITE config, so a legal MDX page writes `<YourRights />`
 *       with no props. The .md mirrors and /llms-full.txt print the same clauses through
 *       CONTENT_MARKDOWN_LEGAL's legalMarkdownTransform.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Tue Oct 6, 2026
 */

import {
  Changes,
  type ChangesProps,
  DataWeKeep,
  DmcaNotice,
  LegalContact,
  NoWarranty,
  Processors,
  YourRights,
} from "@haruhimemoe/next-kit/legal";
import { mdxComponents } from "@haruhimemoe/ui/mdx";
import "@haruhimemoe/ui/shiki";
import type { MDXComponents } from "mdx/types";
import { LEGAL_SITE } from "@/constants/legal-site";

/** The seven legal blocks, bound to LEGAL_SITE, for MDX pages to drop in with no props. */
const LEGAL_COMPONENTS: MDXComponents = {
  LegalContact: () => <LegalContact site={LEGAL_SITE} />,
  DataWeKeep: () => <DataWeKeep site={LEGAL_SITE} />,
  Processors: () => <Processors site={LEGAL_SITE} />,
  YourRights: () => <YourRights site={LEGAL_SITE} />,
  DmcaNotice: () => <DmcaNotice site={LEGAL_SITE} />,
  NoWarranty: () => <NoWarranty site={LEGAL_SITE} />,
  Changes: (props: Omit<ChangesProps, "site">) => <Changes site={LEGAL_SITE} {...props} />,
};

/**
 * @function useMDXComponents
 * @param components {MDXComponents} app-only overrides passed in by callers, if any
 * @returns {MDXComponents} the components MDX pages render with (Next.js asks for this file)
 */
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return { ...mdxComponents, ...LEGAL_COMPONENTS, ...components };
}
