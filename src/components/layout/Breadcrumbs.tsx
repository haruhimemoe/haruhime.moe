/**
 * @file src/components/layout/Breadcrumbs.tsx
 * @desc A sub page's trail above its title ("Libraries / ui", "Changelog / ui"): each parent a
 *       muted plain link (underlined on hover), the page itself last in bold as text marked
 *       current. Server only.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { TextLink } from "@haruhimemoe/ui";

/** One parent page in the trail. */
export type Crumb = { readonly href: string; readonly label: string };

/**
 * @function Breadcrumbs
 * @param props {{ parents: readonly Crumb[]; current: string }} the parent pages, top first, and
 *   the current page's name
 * @returns {JSX.Element} a "Breadcrumb" nav with an ordered list of the trail
 */
export function Breadcrumbs({ parents, current }: { parents: readonly Crumb[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-c3 text-sm">
        {parents.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <TextLink
              href={crumb.href}
              variant="plain"
              className="font-normal text-c3 hover:text-c1"
            >
              {crumb.label}
            </TextLink>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="font-bold text-c1">
          {current}
        </li>
      </ol>
    </nav>
  );
}
