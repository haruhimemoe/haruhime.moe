/**
 * @file src/components/ui/ButtonLink.tsx
 * @desc next/link styled as a pill button.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import Link from "next/link";
import type { ComponentProps } from "react";
import { type ButtonSize, type ButtonVariant, buttonClasses } from "@/components/ui/buttonStyles";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize };

/**
 * @function ButtonLink
 * @param props {ButtonLinkProps} next/link props, plus an optional button variant and size
 * @returns {JSX.Element} a next/link styled as a pill button
 */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
