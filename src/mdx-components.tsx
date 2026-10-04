/**
 * @file src/mdx-components.tsx
 * @desc Global MDX element overrides (required by @next/mdx in the App Router): shared
 *       @haruhimemoe/ui element overrides (links, heading anchors, callouts, tables, highlighted
 *       code blocks), the same as packs. Registers Shiki highlighting as a side effect, for any
 *       fenced code block a content page adds.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { mdxComponents } from "@haruhimemoe/ui/mdx";
import "@haruhimemoe/ui/shiki";
import type { MDXComponents } from "mdx/types";

/**
 * @function useMDXComponents
 * @param components {MDXComponents} app-only overrides passed in by callers, if any
 * @returns {MDXComponents} the components MDX pages render with (Next.js asks for this file)
 */
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return { ...mdxComponents, ...components };
}
