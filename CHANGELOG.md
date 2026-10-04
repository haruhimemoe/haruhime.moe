# Changelog

All notable changes to haruhime.moe are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- /thanks: an osu!-style player card for every osu! player thanked (avatar, cover, flags, linked to their osu! profile when we know which account is theirs). The cards come from a snapshot taken once, so the page still never calls osu!.
- /ui: a PlayerCard demo in the osu! group, and a Content group for ui's docs, legal and brand page components.
- `/legal`, an index of the legal pages, and each legal page as Markdown at `/legal/<page>.md` (linked from `/llms.txt`, with a Copy as Markdown button on the page).

### Changed

- The disclaimer, terms and privacy policy moved to `/legal/disclaimer`, `/legal/terms` and `/legal/privacy`, the same addresses the tools use. The old addresses are gone.
- `/brand` is the shared brand page every haruhime site uses: name, logo and banner files, colors, type, do's and don'ts and the brand contact (haruhime@haruhime.moe), with every repo's README banner and the product family kept.
- `/llms.txt` lists the legal pages under Legal, linking their Markdown.
- `@haruhimemoe/ui` 0.11.0, `@haruhimemoe/next-kit` 0.6.1, `@haruhimemoe/brand` 0.7.0.
- `@haruhimemoe/ui` 0.11.1: decorative alt on brand page previews.
- `@haruhimemoe/ui` 0.11.2: Copy as Markdown works on Safari and iOS.
- Depends on `@haruhimemoe/ui` 0.12.0: on touch screens buttons, chips and form fields are 44px tall, motion stops when your system asks for reduced motion, colors get stronger when it asks for more contrast, the code samples on /ui are highlighted, and /ui shows Text, textClasses, useMotionAllowed, hidden field labels, download links and all 17 ModBadge colors.

## [0.3.0] - 2026-10-04

### Added

- `/changelog`: every haruhimemoe repo's releases in one feed, newest first, read from each repo's `CHANGELOG.md` and refreshed about once a day. Filter links narrow it to the apps (`/changelog/kind/apps`), the packages (`/changelog/kind/packages`) or one repo. The newest five releases start open.
- `/changelog/<repo>`: one repo's whole changelog (haruhime.moe, packs, pools, bb, each `@haruhimemoe` package and the Claude plugin), with what's on main but not released yet on top and an anchor per release (`#v0-9-0`).
- Changelog in the footer's haruhime.moe column, after Libraries. `/llms.txt` lists every changelog page and `/llms-full.txt` carries each repo's three newest releases.

### Changed

- A library's Changelog link (on `/libraries` and its docs page) opens its changelog page here instead of the file on GitHub.

## [0.2.0] - 2026-10-04

### Added

- `/llms-full.txt`: the brand page, every library's docs page and the three legal pages in one Markdown file, built with `@haruhimemoe/next-kit` 0.5.0's `llmsFull`.
- `/libraries`: the eight `@haruhimemoe` packages (ui, next-kit, osu, hinai, pool, compliance, bbcode, brand), one card each with its description, install line, npm version and downloads over the last month, GitHub stars and latest release, and links to GitHub, npm and the changelog (and the showcase for ui). The numbers refresh about once a day.
- `/libraries/<name>`: each package's README, rendered from its repo, under its version, license, an install line to copy and its links. When the README can't be fetched the page points at it on GitHub.
- `/terms` and `/privacy` for this site: short, since the site has no accounts, cookies or analytics; each links the tools' own terms and privacy pages.
- Libraries in the footer's haruhime.moe column, after Thanks, and Terms and Privacy under Legal. Each library card carries the repo's README banner.
- The Evergreen Cup banner shows Evergreen Cup's Seattle skyline art: a looping video (still under reduced motion), its name and line, and one link to evergreencup.org. Wide on desktop, taller on phones.

### Changed

- `/ui` shows `@haruhimemoe/ui` 0.8.0's Palette group: `CommandPalette` (one instance, mounted for the whole page; Ctrl K/Cmd K opens it from anywhere on `/ui`), `CommandPaletteButton`, `openCommandPalette` (a plain button, no ref) and `siteCommands` (built from this site's own pages and `haruhimemoe/haruhime.moe` for "Report a bug"), plus the calculator and ranking helpers `evaluate`, `formatResult` and `fuzzyScore`.
- `/libraries/<name>` renders READMEs through `@haruhimemoe/ui` 0.9.0's shared MDX components: `mdxComponents` and its own remark plugin (`@haruhimemoe/ui/remark`) replace this site's hand-rolled `pre`/external-link overrides and `rehype-slug`. Headings get a visible `#` anchor link beside them (h2/h3 only, down from h1-h6), fenced code gets a copy button and Shiki syntax highlighting (`shiki` 4.5.0, `@haruhimemoe/ui/shiki`), and a GitHub-style `> [!NOTE]`/`[!TIP]`/`[!WARNING]` blockquote renders as a labelled `role="note"` Callout. The sanitize schema now allows the attributes the remark plugin writes (a code block's `language-*` class and fence `data-meta`, a callout blockquote's `data-callout`) instead of `rehype-slug`'s ids. The site moves to `@haruhimemoe/ui` 0.9.0.
- The homepage's lead no longer ends with the ppy sentence; the footer line and `/disclaimer` carry it.
- Tool cards sit two to a row above phone width, with the icon, name and beta or coming-soon pill on one line and the tagline under it.
- `/ui` leaves the footer: `/libraries` and the ui card link it, and it links its README at `/libraries/ui`.

- `/ui` shows `@haruhimemoe/ui` 0.6.0's "haruhime tools" footer column (`SiteFooter`'s `tools` prop, `HARUHIME_TOOLS`, `haruhimeToolsColumn`), which packs, pools and bb now use. This site's own footer keeps its Tools column, which already lists every tool (sheets as soon). next-kit moves to 0.4.0 and brand to 0.6.0.

- Each live tool's homepage card has one sentence on what you do with it and a link to its main task: Make a pack, Make a pool, Make a collab banner.
- `sitemap.xml` dates every page with the day its content last changed.
- The homepage's structured data adds a WebSite with packs, pools and bb as its parts, and the organization lists the Discord server and the npm org alongside GitHub.
- bb.haruhime.moe is live: its homepage card, header and footer links and `/llms.txt` line (with a link to bb's own `/llms.txt`).
- /thanks thanks token for BoBERT and the okay to use its map embeddings for similar-map suggestions in pools.

- `/ui` shows the @haruhimemoe/ui 0.5.0 components: Tabs (with tabId and tabPanelId), VisibilitySelect (as radios and as a select, with VISIBILITIES and VISIBILITY_TEXT), CharCounter on a live textarea, and ReportDisclosure. The site moves to ui 0.5.0.
- `/brand` shows a README banner for every haruhimemoe repo (the site, `.github`, packs, pools, the packages and the Claude Code plugin), each linking its repo, with dark and light SVGs to download from `/brand/repos/`.
- A Discord icon in the footer, before the GitHub one, linking the haruhime.moe server. `/contact` lists the server too, and `/llms.txt` links it under Elsewhere.
- A README banner for `@haruhimemoe/next-kit`, the Next.js server kit, on `/brand` and in `/brand/repos/`.
- bb, an osu! BBCode editor with templates, listed as coming soon on the homepage, in the header and footer, on `/brand` and in `/llms.txt`, with its icon from `@haruhimemoe/brand`.
- README banners for bb.haruhime.moe and `@haruhimemoe/bbcode`, the BBCode parser and renderer, on `/brand` and in `/brand/repos/`.
- `/ui` shows every component `@haruhimemoe/ui` 0.4.0 adds: `Badge`, `Disclosure`, `TextLink` and `linkClasses`, `RadioGroup`, `InlineConfirm`, `AsyncButton`, `TypeToConfirm`, `Pagination`'s button mode, `ChoiceChips`, a `Chip` blocked with a reason, the table parts over the sample pool, `StarRating`, `BeatmapStats`, `ModBadge`, `LinkTabs`, `HeaderMenu` and `cx`, in new Text, Tables, osu! and Utilities groups.

- Search titles name what each page is, as "keywords · haruhime.moe" (the homepage: "osu! tools for players, mappers and hosts · haruhime.moe"), and every page has its own 140-160 character description.
- The homepage's heading is now "osu! tools for players, mappers and tournament hosts", with the hello and a line on what each tool does under it. The Evergreen Cup banner stays on top, without a heading of its own.
- Metadata, `robots.txt`, `sitemap.xml`, `/llms.txt` and the structured data come from `@haruhimemoe/next-kit` 0.3.0's SEO helpers, shared with packs, pools and bb. `@haruhimemoe/ui` 0.5.1.
- `robots.txt` names every AI crawler in its own allow group, so the allow-all stance is written down. Nothing is blocked.
- `/llms.txt` opens with a note on what the site is and that it isn't affiliated with ppy, and lists sheets as coming soon in a note instead of a line under Tools.
- haruhime.moe now describes itself as osu! tools for players, mappers and tournament hosts, not just tournament tools: the homepage title and hello, the site description, `/brand`, `/llms.txt` and the link preview's alt text.
- `@haruhimemoe/brand` 0.5.0: haruhime's new tagline ("osu! tools for players, mappers and hosts") redraws the haruhime banners, the link preview and the haruhime.moe and `.github` repo banners.
- The homepage's tool cards sit two across on small screens and four across on wide ones.
- pools is listed as live, in beta: the homepage card (with a small "beta" label), the header and the footer link to https://pools.haruhime.moe, and `/llms.txt` says what pools does and links its own llms.txt.
- `/llms.txt` says what packs does too.
- `/thanks` thanks otdb for the okay to list pools from its mappool export, instead of for the packs pool archive.
- `/ui` says packs and pools are built from `@haruhimemoe/ui` too.
- `/ui` runs `@haruhimemoe/ui` 0.4.0. It shows `DiscordIcon`, and the titled card in the `Card` demo sets `headingLevel`, so its heading sits under the demo's.
- Every page sends less JavaScript: the header's nav renders on the server and no longer brings tailwind-merge to the browser.
- pools is described as what it now is, a mappool builder: a mod-lens map search, co-editors and a download through packs, with past tournament pools there for reference (`/llms.txt`).
- Text links use the kit's `TextLink` look: underlined pink in running text, bold names that underline on hover in lists. Tool cards and thanks entries are the kit's `Card`, and a tool's "beta" or "coming soon" label is its `Badge`.
- The header draws the wordmark inline from `@haruhimemoe/ui` instead of loading it as an image.
- On phones, the Evergreen Cup banner puts its button under the text instead of squeezing the text into a narrow column.
- Page titles and descriptions come from one list, so a page's meta description, its `/llms.txt` line and its footer label match.
- `/ui`'s length boxes read what packs and pools read: `2.5` and `2,5` mean two and a half minutes.
- `/contact` and SECURITY.md point security reports to GitHub's private vulnerability reporting first, then email.
- `/.well-known/security.txt` expires on a pinned date (September 1, 2027) instead of a year after the last deploy.
- Pages send a tighter Content-Security-Policy: `base-uri`, `object-src` and `form-action` are `'none'` too.

### Fixed

- Accessibility: a coming-soon tool card dims only its icon, so its tagline keeps full contrast; `/libraries` card names are h2s under the page's h1; README code blocks on `/libraries/<name>` can be reached with the keyboard; the homepage's Tools section no longer doubles the footer's Tools landmark. The site moves to `@haruhimemoe/ui` 0.7.0 (its accessibility release: one footer nav with headed columns, lighter accent links, a visible focus ring on fields).
- Links to `/thanks`, `/brand`, `/ui`, `/contact` and `/disclaimer` unfurl with the link preview image and the site name again (a page's own Open Graph data used to replace the site's).
- `/llms.txt` calls the home page's Evergreen Cup section a banner, as the page does, instead of a card.

## [0.1.0] - 2026-09-24

### Added

- The home page: packs, pools and sheets as tool cards (pools and sheets marked "coming soon"), an Evergreen Cup banner at the top, and the site's Organization and Person structured data.
- `/thanks`: the people and projects the tools lean on.
- `/brand`: how to write the name, the logos and README banners to download (SVG, and the dark banner as PNG), the color swatches with their hex values, the palette JSON, each tool's icon and hue, and the type.
- `/ui`: every `@haruhimemoe/ui` component rendered in its states, with working filter demos over a sample mappool.
- `/contact` and `/disclaimer` (no ppy affiliation, the osu! API and hinai mirror terms, beatmap ownership, the as-is notice, and a note that AI coding tools helped build the site).
- A header with the tools, and a footer with Tools, haruhime.moe and Legal columns, the trademark line and a GitHub link, all from `@haruhimemoe/ui`.
- `/llms.txt`, `/.well-known/security.txt` (RFC 9116), `/sitemap.xml` and `/robots.txt`.
- The favicon, Apple icon and link preview image, generated by `@haruhimemoe/brand`.
- Security headers on every page: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` and `frame-ancestors 'none'`.

[unreleased]: https://github.com/haruhimemoe/haruhime.moe/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/haruhimemoe/haruhime.moe/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/haruhimemoe/haruhime.moe/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/haruhimemoe/haruhime.moe/releases/tag/v0.1.0
