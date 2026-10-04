# AGENTS.md

Rules for any agent (or human) working in this repo. Authoritative; `CLAUDE.md` only includes it.

## 1. What this is

haruhime.moe: a small static hub for haruhime's osu! tools for players, mappers and tournament hosts (packs, pools, bb, sheets), an Evergreen Cup banner, a few plain pages (thanks, brand, contact, disclaimer, terms, privacy), `/libraries` (the eight `@haruhimemoe` packages with live npm and GitHub numbers, and each package's README rendered at `/libraries/<name>`), and `/ui`, a showcase of every `@haruhimemoe/ui` component. It also serves `/llms.txt`, `/.well-known/security.txt`, `/sitemap.xml` and `/robots.txt`. It shares its look and brand kit with packs.haruhime.moe, pools.haruhime.moe and bb.haruhime.moe. Canonical address: `https://www.haruhime.moe` (`SITE.url`).

**Hard rule: every route is static.** No database, no API routes, no auth, no per-request rendering. The two text route handlers (`llms.txt`, `.well-known/security.txt`) set `dynamic = "force-static"` and render once at build. `bun run build` must list every route as `○ (Static)` or, for the two library routes only, `○`/`●` with a 1d revalidate: `/libraries` and `/libraries/[name]` prerender at build from npm and GitHub (`src/lib/libraries/`, keyless public APIs, every fetch `next: { revalidate: 86400 }`) and Next rebuilds them in the background at most once a day. A visitor never waits on npm or GitHub, and a failed lookup renders a dash (or a "read it on GitHub" line for a README), never an error. Keep client JavaScript to what Next needs: no `"use client"` components of our own unless a page can't work without one. Our only client files are `EgcBanner` (it mounts the skyline video after hydration, and only when the visitor allows motion) and `/ui`'s demos that take callbacks or hold state (`FilterDemos`, `ChipDemos`, `ConfirmDemos`, `PaginationDemos`); the other demos render on the server, and a `@haruhimemoe/ui` component that needs the browser (Disclosure, RadioGroup, HeaderMenu) brings its own client code. Every page also loads the header nav's client chunk (about 4 KB gzipped, mostly `next/link`), though nothing in the header hydrates. The header lists only the tools, and each is an external URL or text marked soon, so no link can be the current page. Since `@haruhimemoe/ui` 0.2.0, `NavLinks` then renders on the server alone and tailwind-merge stays out of the browser. Next still ships the chunk because `SiteHeader` imports the client list, and the footer's internal links need `next/link` anyway. It is not a reason to add client code of our own.

## 2. Layout

```
src/app/          routes: layout.tsx (font, metadata, SiteShell), globals.css, not-found.tsx, one
                  page.tsx per page (/, thanks, brand, libraries, libraries/[name], ui, contact,
                  disclaimer, terms, privacy) with its copy and markup inline, the llms.txt/ and
                  .well-known/security.txt/ route handlers,
                  sitemap.ts, robots.ts, and the generated icon.svg, apple-icon.png,
                  opengraph-image.png and opengraph-image.alt.txt
src/components/   layout/ (SiteShell: the @haruhimemoe/ui frame), home/ (ToolCard, EgcBanner),
                  libraries/ (LibraryCard, StatsRow, LibraryLinks, Markdown: the README renderer,
                  react-markdown + @haruhimemoe/ui's mdx/remark/shiki + rehype-raw + rehype-sanitize),
                  showcase/ (Demo and DemoGroup frame each /ui demo; one <Group>Demos file per
                  group, listed in GROUPS in ui/page.tsx, split further past ~100 lines)
src/constants/    static data (site.ts: identity, EVERGREEN_CUP and PAGES, every page's label,
                  search title, description, last-updated day and footer column; seo.ts:
                  SEO_SITE, the site for @haruhimemoe/next-kit/seo; tools.ts; nav.ts: header and
                  footer links;
                  brand.ts: which swatches, logos and banners /brand shows, and REPO_BANNERS,
                  every repo's README banner; libraries.ts: the eight packages, isLibraryName,
                  findLibrary and libraryUrls; legal.ts: the disclaimer, terms and privacy dates
                  and security.txt's expiry; showcase.ts: /ui's package links and sample pool)
src/content/      editable copy as data (thanks.ts)
src/lib/          the only code that fetches: libraries/ (fetch-json, npm, github, stats, readme),
                  each lookup null on failure, cached by Next for a day
src/utils/        pure, stateless helpers (date, length, pageMetadata, readme transforms, the
                  stat formatters, and the llms.txt and security.txt builders)
public/brand/     generated brand files (see CONTRIBUTING.md); never hand-edit. repos/ holds every
                  haruhimemoe repo's README banner, written by scripts/repo-banners.ts
scripts/          repo-banners.ts (`bun run repo-banners`): draws public/brand/repos from
                  REPO_BANNERS with @haruhimemoe/brand; axe.ts (`bun run test:a11y`): axe in a
                  real browser over every page of a production build, contrast on
tests/            unit/ (node), components/ (jsdom), helpers/ (axe), setup/
llms.txt          repo guide for LLMs (points at the live /llms.txt); not served by the site
```

## 3. Code style

- TypeScript 7, `strict`, `noUncheckedIndexedAccess`. No `any`.
- Biome is the only linter/formatter (`bun run check`, `bun run check:fix`). No ESLint or Prettier.
- No barrel files of our own. Import exact paths (`@/components/home/ToolCard`).
- Shared components (buttons, cards, badges, text links, `PageHeader`, `Prose`, `JsonLd`, the wordmark, the header, footer and page frame) and the `cx` class merger come from [@haruhimemoe/ui](https://github.com/haruhimemoe/ui), imported from `"@haruhimemoe/ui"`. Don't copy one into `src/components/`; only site-specific pieces live there. Brand colors come from `@haruhimemoe/brand/palette` (`palette`, `TOKENS`, `hslToHex`), never a local copy.
- One exported component per file, PascalCase filename. A small private helper can sit beside it (`EvergreenMark` in `EgcBanner.tsx`).
- Style with Tailwind classes, no CSS modules. Inline `style` is only for values that come from data, like the `/brand` swatch colors.
- `utils/` is pure.

## 4. File headers

Every `.ts`, `.tsx`, `.mjs`, and `.css` source file starts with this block (`.css` files open it with `/*` instead of `/**`):

```ts
/**
 * @file <repo-relative path>
 * @desc <what it is and why>
 * @author David @dvhsh (https://dvh.sh)
 * @created Ddd MMM D, YYYY
 * @modified Ddd MMM D, YYYY
 */
```

Dates match `date "+%a %b %-d, %Y"`. Update `@modified` on edits, never `@created`. Exported functions outside `src/app/` get a JSDoc block with `@function`, `@param`, `@returns` (and `@throws` when they throw). The Next exports in `src/app/` (page and layout components, the route handlers' `GET`, `sitemap()`, `robots()`) skip it; the file header says what they do.

## 5. Tests

- Everything under `tests/`. Never co-locate tests in `src/`.
- `tests/unit/` (node) mirrors `src/` paths: `src/utils/color.ts` is tested by `tests/unit/utils/color.test.ts`, `src/app/sitemap.ts` by `tests/unit/app/sitemap.test.ts`. Scripts follow the same rule: `scripts/repo-banners.ts` by `tests/unit/scripts/repo-banners.test.ts`.
- `tests/components/` (jsdom) mirrors `src/components/` without the `components/` segment: `src/components/home/ToolCard.tsx` is tested by `tests/components/home/ToolCard.test.tsx`. Each `/ui` demo file with behavior of its own (a new component's states, a callback) gets its own test there too; `UiPage.test.tsx` checks the page, that every export has a demo, and axe.
- Page tests are flat, named after the page's default export: `tests/components/app/<Name>.test.tsx`. `src/app/ui/page.tsx` (`UiPage`) is tested by `tests/components/app/UiPage.test.tsx`, `src/app/page.tsx` by `HomePage.test.tsx`, `src/app/not-found.tsx` by `NotFound.test.tsx`.
- `bun run test` runs both Vitest projects; `test:unit` and `test:components` run one.
- The unit project runs with `TZ=America/Los_Angeles` on purpose. Don't remove it.
- Every page gets a render test (its metadata title and its one h1). Tests never hit the network.
- `/ui`'s test also runs axe through `tests/helpers/axe.ts`.
- Coverage floor: 90% on `src/utils/**`, enforced by `bun run test:coverage` (what CI runs).
- `bun run test:a11y` (after `bun run build`) runs axe-core in headless Chromium over every page at a desktop and a phone width with color contrast on, WCAG 2.2 AA plus best practices, and fails on any violation. CI runs it after the build; `bunx playwright install chromium` once locally. The jsdom axe runs can't check contrast, so this is where a dim text color or a duplicate landmark shows.

## 6. Visual system

The packs look, from the [@haruhimemoe/ui](https://github.com/haruhimemoe/ui) theme that `src/app/globals.css` imports: `b1`–`b6` backgrounds, `c1`–`c4` text, `h1`/`h2` accent, all from `--hue: 333` (set in `globals.css`). Dark only. Font: Nunito via `--font-nunito`. Add only site-specific rules to `globals.css`; tokens and the focus ring belong to the theme.

- Page titles go through `PageHeader`; one h1 per page. Structured data goes through `JsonLd`. Long-form text goes in `Prose`.
- Text links use `TextLink` from `@haruhimemoe/ui` (`accent` in running text, `plain` for names in a list); an anchor `TextLink` can't be (a download) uses `linkClasses()`. Every focusable element keeps the global focus ring.
- Images need alt text; decorative ones (an icon next to its name) use `alt=""`.
- Check every page at phone width.

## 7. Content

- Copy is short and plain, in David's voice. No marketing, no em dashes.
- The thanks list is `src/content/thanks.ts`: a name, an optional https link, one line each.
- Tools live in `src/constants/tools.ts`. A tool gets its `url` the day it launches; until then it shows as "coming soon" (homepage and `/llms.txt`) and "soon" (header and footer) and links nowhere. A live tool still in beta sets `beta: true`: its homepage card shows a small "beta" label and its `/llms.txt` line says "In beta." (the header and footer stay plain). `about` is the tool's longer `/llms.txt` description and `llmsTxt: true` links the tool's own `/llms.txt`; `summary` (one concrete sentence) and `task` (its main task's label and path) fill out the homepage card. All four are for live tools only. `tests/unit/constants/tools.test.ts` pins which tools are live and which are in beta, so update it in the same commit. Never write that every pool on pools comes from otdb: pools lists pools from several sources.
- A new page gets an entry in `PAGES` (`src/constants/site.ts`): its `title` (one word: the footer label and `/llms.txt` link text), `seoTitle` (the search keywords; the helper appends " · haruhime.moe", keep the whole under 60 characters), a 140-160 character `description`, `lastUpdated` and, if visitors need a footer link, its footer column (`/ui` has none: `/libraries` and the ui card reach it). PAGES order is footer and sitemap order. The sitemap, `/llms.txt` and the footer read it, and the page's metadata is `pageMetadata("/path")`. It also needs a render test. Bump a page's `lastUpdated` when its visible content changes, never otherwise: it is the sitemap's lastmod.
- SEO goes through `@haruhimemoe/next-kit/seo` with `SEO_SITE` (`src/constants/seo.ts`), never hand-built: `siteMetadata` in the layout, `homeMetadata` on `/`, `pageMetadata` (via `src/utils/page-metadata.ts`) on every other page, `notFoundMetadata` on the 404, `robots` and `sitemapEntries`, `llmsTxt`/`textResponse` for `/llms.txt`, and `ld` for JSON-LD. A page's own `openGraph` replaces the layout's, so never set a partial one: the helpers always include the site image. `SEO_SITE.ogImages` must match `src/app/opengraph-image.png` (1200x630). The Organization `@id` is `https://www.haruhime.moe/#organization` (next-kit's `HARUHIME_ORG`); packs, pools and bb point at it, so it never changes. robots allows every search and AI bot (`aiBots: "allow"`).
- Every haruhimemoe repo's README banner comes from `REPO_BANNERS` in `src/constants/brand.ts`. After changing it or `@haruhimemoe/brand`, run `bun run repo-banners --png <dir>`, look at every PNG, and commit the SVGs in `public/brand/repos/` (never the PNGs). Package taglines read `@haruhimemoe/<name>: <a few words>` (claude-plugin: `haruhime: ...`, since it isn't an npm package) and must fit the banner; `tests/unit/scripts/repo-banners.test.ts` measures them. A tool's entry takes its tagline from its `TOOLS` entry, the one copy of its product's `@haruhimemoe/brand` tagline in this repo (`/brand` reads each tagline out as the preview's alt text without drawing with the package); the same test fails when the copy drifts. Next won't serve a public file whose name starts with a dot, so `next.config.ts` rewrites `.github`'s two banner URLs to haruhime.moe's identical files. If `.github` ever draws something different, drop the rewrite and give its files a name without the leading dot. `/brand` already saves them without it, since a download named `.github-banner.svg` would be a hidden file.
- Disclaimer, terms and privacy wording changes bump `DISCLAIMER_UPDATED`, `TERMS_UPDATED` or `PRIVACY_UPDATED` in `src/constants/legal.ts` in the same commit. Each page's test guards its required clauses. The terms and privacy pages cover this site only and link each live tool's own `/legal/terms` and `/legal/privacy`.
- A new `@haruhimemoe` package gets an entry in `LIBRARIES` (`src/constants/libraries.ts`): its short name (also the repo and the URL segment), hue, a one-line description under 160 characters, and `showcase` only when this site has a page that demos it. `/libraries`, `/libraries/<name>`, the sitemap and `/llms.txt` read it. Its card shows `public/brand/repos/<name>-banner.svg`, so a new package needs its banner drawn first (`REPO_BANNERS`). The docs page renders the repo's `README.md` from `main` through `src/utils/readme.ts` (the banner paragraph and the `# title` line are dropped, relative links point at GitHub) and `Markdown` (GitHub's sanitize schema plus heading ids and picture/source). READMEs are our own, so the sanitizer is defense in depth, not the trust boundary.
- `SECURITY_TXT_EXPIRES` in `src/constants/legal.ts` is security.txt's Expires, fixed at build. When `tests/unit/constants/legal.test.ts` fails (60 days out), move it up to a year ahead and redeploy.

## 8. Commits and PRs

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- The footer doesn't use ui's `tools` prop (the "haruhime tools" column the tool sites add): its Tools column already lists every tool, sheets included. `/ui` demos that column instead.
- Before pushing: `bun run check && bun run typecheck && bun run test && bun run build && bun run test:a11y`. The build fetches from npm and GitHub for `/libraries`; offline it still passes, with dashes.
- Accessibility rules the site adds to ui's: dim an unreleased tool's art, never its text (`opacity` on a card drops `text-c4` under 4.5:1); one landmark per name (the footer's columns are regions named Tools, haruhime.moe and Legal, so a page section with one of those names stays unlabelled); card headings sit one level under the page's h1; README code blocks are focusable (`Markdown`'s `pre`), since a wide one scrolls.
- A change a visitor would notice gets a line under `## [Unreleased]` in `CHANGELOG.md` ([Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)). Never rewrite a released entry. Don't bump `version` in `package.json` or tag; releases are cut by the maintainers.
- When a change affects conventions, update this file in the same PR. When it moves a docs file or a README heading, update the links in the root `llms.txt` too.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
