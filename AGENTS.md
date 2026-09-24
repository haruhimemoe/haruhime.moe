# AGENTS.md

Rules for any agent (or human) working in this repo. Authoritative; `CLAUDE.md` only includes it.

## 1. What this is

haruhime.moe: a small static hub for haruhime's osu! tournament tools (packs, pools, sheets), an Evergreen Cup banner, a few plain pages (thanks, brand, contact, disclaimer), and `/ui`, a showcase of every `@haruhimemoe/ui` component. It also serves `/llms.txt`, `/.well-known/security.txt`, `/sitemap.xml` and `/robots.txt`. It shares its look and brand kit with packs.haruhime.moe. Canonical address: `https://www.haruhime.moe` (`SITE.url`).

**Hard rule: every route is static.** No database, no API routes, no auth, no per-request rendering. The two text route handlers (`llms.txt`, `.well-known/security.txt`) set `dynamic = "force-static"` and render once at build. `bun run build` must list every route as `○ (Static)`. Keep client JavaScript to what Next needs: no `"use client"` components of our own unless a page can't work without one. `/ui`'s filter demos are our one client file. Every page also loads one client chunk we don't need (about 9 KB gzipped): `SiteHeader` from `@haruhimemoe/ui` always renders its nav list, `NavLinks`, as a client component so it can mark the current page, and it brings tailwind-merge along. On this site no header link can ever be current: the header lists only the tools, packs is an external URL, and pools and sheets aren't links until they launch. Drop the chunk once a later `@haruhimemoe/ui` renders the list on the server when no link is internal (or drops tailwind-merge from it). It is not a reason to add client code of our own.

## 2. Layout

```
src/app/          routes only (thin; compose components): the pages, llms.txt/ and
                  .well-known/security.txt/ route handlers, sitemap.ts, robots.ts, plus the
                  generated icon/preview files
src/components/   layout/ (SiteShell: the @haruhimemoe/ui frame), ui/ (linkStyles), home/ (homepage
                  pieces), showcase/ (the /ui demos)
src/constants/    static data (site.ts: identity and PAGE_PATHS; tools.ts; nav.ts: header and footer
                  links; brand.ts: brand kit; legal.ts: the disclaimer date)
src/content/      editable copy as data (thanks.ts)
src/utils/        pure, stateless helpers (cn, color, date, length, and the llms.txt and
                  security.txt builders)
public/brand/     generated brand files (see CONTRIBUTING.md); never hand-edit
tests/            unit/ (node), components/ (jsdom), helpers/ (axe), setup/
llms.txt          repo guide for LLMs (points at the live /llms.txt); not served by the site
```

## 3. Code style

- TypeScript 7, `strict`, `noUncheckedIndexedAccess`. No `any`.
- Biome is the only linter/formatter (`bun run check`, `bun run check:fix`). No ESLint or Prettier.
- No barrel files of our own. Import exact paths (`@/components/home/ToolCard`).
- Shared components (buttons, cards, `PageHeader`, `Prose`, `JsonLd`, the header, footer and page frame) come from [@haruhimemoe/ui](https://github.com/haruhimemoe/ui), imported from `"@haruhimemoe/ui"`. Don't copy one into `src/components/`; only site-specific pieces live there.
- One component per file, PascalCase filename, Tailwind only, no CSS modules.
- `utils/` is pure.

## 4. File headers

Every `.ts`, `.tsx`, `.mjs`, and `.css` source file starts with:

```ts
/**
 * @file <repo-relative path>
 * @desc <what it is and why>
 * @author David @dvhsh (https://dvh.sh)
 * @created Ddd MMM D, YYYY
 * @modified Ddd MMM D, YYYY
 */
```

Dates match `date "+%a %b %-d, %Y"`. Update `@modified` on edits, never `@created`. Exported functions get a JSDoc block with `@function`, `@param`, `@returns` (and `@throws` when they throw).

## 5. Tests

- Everything under `tests/`, mirroring `src/` paths. Never co-locate tests in `src/`.
- `bun run test` runs both Vitest projects; `test:unit` and `test:components` run one.
- The unit project runs with `TZ=America/Los_Angeles` on purpose. Don't remove it.
- Every page gets a render test (its metadata title and its one h1). Tests never hit the network.
- `/ui`'s test also runs axe through `tests/helpers/axe.ts`.
- Coverage floor: 90% on `src/utils/**`, enforced by `bun run test:coverage` (what CI runs).

## 6. Visual system

The packs look, from the [@haruhimemoe/ui](https://github.com/haruhimemoe/ui) theme that `src/app/globals.css` imports: `b1`–`b6` backgrounds, `c1`–`c4` text, `h1`/`h2` accent, all from `--hue: 333` (set in `globals.css`). Dark only. Font: Nunito via `--font-nunito`. Add only site-specific rules to `globals.css`; tokens and the focus ring belong to the theme.

- Page titles go through `PageHeader`; one h1 per page. Structured data goes through `JsonLd`. Long-form text goes in `Prose`.
- Text links use `linkStyles` (`src/components/ui/linkStyles.ts`). Every focusable element keeps the global focus ring.
- Images need alt text; decorative ones (an icon next to its name) use `alt=""`.
- Check every page at phone width.

## 7. Content

- Copy is short and plain, in David's voice. No marketing, no em dashes.
- The thanks list is `src/content/thanks.ts`: a name, an optional https link, one line each.
- Tools live in `src/constants/tools.ts`. A tool gets its `url` the day it launches; until then it shows as "coming soon" (homepage and `/llms.txt`) and "soon" (header and footer) and links nowhere. `tests/unit/constants/tools.test.ts` pins which tools are live, so update it in the same commit.
- A new page goes in `PAGE_PATHS` (`src/constants/site.ts`) so the sitemap and `/llms.txt` list it. It also needs a title and description in `PAGES` in `src/utils/llms-txt.ts` (typecheck fails without one), a render test, and a footer link in `src/constants/nav.ts` if visitors need one.
- Disclaimer wording changes bump `DISCLAIMER_UPDATED` in `src/constants/legal.ts` in the same commit. Its test guards the required clauses.

## 8. Commits and PRs

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- Before pushing: `bun run check && bun run typecheck && bun run test && bun run build`.
- A change a visitor would notice gets a line under `## [Unreleased]` in `CHANGELOG.md` ([Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)). Never rewrite a released entry. Don't bump `version` in `package.json` or tag; releases are cut by the maintainers.
- When a change affects conventions, update this file in the same PR. When it moves a docs file or a README heading, update the links in the root `llms.txt` too.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
