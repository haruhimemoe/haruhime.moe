<p align="center"><a href="https://www.haruhime.moe"><picture><source media="(prefers-color-scheme: light)" srcset="https://www.haruhime.moe/brand/repos/haruhime.moe-banner-on-light.svg"><img alt="haruhime.moe" src="https://www.haruhime.moe/brand/repos/haruhime.moe-banner.svg" width="640"></picture></a></p>

# haruhime.moe

The home page for haruhime's osu! tools for players, mappers and tournament hosts: [packs](https://packs.haruhime.moe), [pools](https://pools.haruhime.moe) (in beta; build a mappool with a mod-lens map search and co-editors, then download it through packs), [bb](https://bb.haruhime.moe) (an osu! BBCode editor with templates) and, on the way, sheets. It also has a thanks list, the brand kit, the [libraries](https://www.haruhime.moe/libraries) the tools are built from (each with its README as a docs page), a showcase of the shared [@haruhimemoe/ui](https://github.com/haruhimemoe/ui) components, contact details, a disclaimer, terms and a privacy policy.

Live at https://www.haruhime.moe.

## Pages

| Path | What's there |
| --- | --- |
| [`/`](https://www.haruhime.moe/) | The tools, an Evergreen Cup banner and a short hello |
| [`/thanks`](https://www.haruhime.moe/thanks) | The people and projects the tools lean on |
| [`/brand`](https://www.haruhime.moe/brand) | The name, logos and banner files, colors, type, do's and don'ts, every haruhimemoe repo's README banner and the tool icons |
| [`/libraries`](https://www.haruhime.moe/libraries) | The nine @haruhimemoe packages: description, install line, npm version and downloads, GitHub stars and latest release, links |
| [`/libraries/<name>`](https://www.haruhime.moe/libraries/ui) | A package's README, rendered from its repo's main branch, under its version, license, install line and links |
| [`/changelog`](https://www.haruhime.moe/changelog) | Every haruhimemoe repo's releases in one feed, newest first, filterable to apps, packages or one repo |
| [`/changelog/<repo>`](https://www.haruhime.moe/changelog/haruhime.moe) | One repo's whole changelog, with what's on main but not released yet on top |
| [`/ui`](https://www.haruhime.moe/ui) | Every @haruhimemoe/ui component, rendered in its states: basics, text, forms, confirms and async actions, filters, tables, osu! pieces, icons and the shell |
| [`/contact`](https://www.haruhime.moe/contact) | Email, the Discord server, GitHub and where to send security reports |
| [`/legal`](https://www.haruhime.moe/legal) | The legal pages, each also served as Markdown at `/legal/<page>.md` |
| [`/legal/disclaimer`](https://www.haruhime.moe/legal/disclaimer) | No ppy affiliation, the osu! API and mirror terms, who owns beatmaps, the as-is notice, the AI-help note |
| [`/legal/terms`](https://www.haruhime.moe/legal/terms) | Terms for this site only: what it is, the MIT libraries, no warranty; each tool's own terms are linked |
| [`/legal/privacy`](https://www.haruhime.moe/legal/privacy) | What this site collects (nothing of its own), Vercel's logs, the server-side stats fetches; each tool's own policy is linked |

The site also serves [`/llms.txt`](https://www.haruhime.moe/llms.txt) (a guide to the site for LLMs), [`/llms-full.txt`](https://www.haruhime.moe/llms-full.txt) (the brand page, every library's docs page, each repo's newest changelog entries and every legal page, in full), [`/.well-known/security.txt`](https://www.haruhime.moe/.well-known/security.txt), `/sitemap.xml` and `/robots.txt`. Every route is static, prerendered at build time. There is no database and nothing to configure. The library and changelog routes fetch their numbers, READMEs and CHANGELOG.md files from npm and GitHub at build and again in the background at most once a day; nothing is fetched per visit.

## Run it locally

Needs [Bun](https://bun.sh) 1.4+ and Node.js 24+.

```bash
git clone https://github.com/haruhimemoe/haruhime.moe.git
cd haruhime.moe
bun install
bun dev
```

Then open http://localhost:3000. No environment variables are needed.

For a production build, run `bun run build`, then `bun run start` to serve it.

## Where the content lives

| To change | Edit |
| --- | --- |
| The thanks list | `src/content/thanks.ts`: a name, an optional https link and one line per entry |
| The tools (name, tagline, icon, hue, link, beta label, the homepage card's sentence and task link, the `/llms.txt` line), including the tool icons on `/brand` | `TOOLS` in `src/constants/tools.ts`: a tool without a `url` shows as "coming soon", and one with `beta: true` gets a "beta" label |
| Header and footer links | `src/constants/nav.ts` (the page links follow each page's `footer` in `PAGES`) |
| A page's label, search title, description and last-updated day (its metadata, sitemap date, `/llms.txt` line and footer label) | `PAGES` in `src/constants/site.ts` |
| The homepage's search title, the link preview image entry | `SEO_SITE` in `src/constants/seo.ts` |
| Site name, address, description, contact email, the Discord invite (the footer icon and `/contact`) | `SITE` in `src/constants/site.ts` |
| The Evergreen Cup banner's name, link and line | `EVERGREEN_CUP` in `src/constants/site.ts` |
| The Evergreen Cup banner's art, scrim and button | `src/components/home/EgcBanner.tsx` and `public/egc/` (the skyline loop and poster, re-encoded from evergreencup.org's hero) |
| The color swatches `/llms-full.txt` lists | `src/constants/brand.ts` |
| Every haruhimemoe repo's README banner (which repos, and each package's tagline) | `REPO_BANNERS` in `src/constants/brand.ts`, then `bun run repo-banners` to redraw them |
| The `/brand` name, writing, do's and don'ts, files and contact | `brandPageData("haruhime")` in [@haruhimemoe/brand](https://github.com/haruhimemoe/brand), rendered by @haruhimemoe/ui's `BrandPage` in `src/app/brand/page.tsx`; this site's extra sections are `src/components/brand/` |
| The disclaimer, terms and privacy policy | `content/legal/<page>.mdx`, and its title, description and date in `CONTENT` (`src/constants/content.ts`) |
| Which libraries `/libraries` lists, each one's description and showcase link | `LIBRARIES` in `src/constants/libraries.ts` |
| Which repos `/changelog` reads, built from the live tools and the libraries | `CHANGELOG_SOURCES` in `src/constants/changelogs.ts` |
| How a README is cleaned up before rendering (banner, title, relative links) | `src/utils/readme.ts` |
| Where the library numbers come from | `src/lib/libraries/` (npm registry and downloads API, GitHub repos and releases) |
| When `/.well-known/security.txt` expires | `SECURITY_TXT_EXPIRES` in `src/constants/legal.ts` (a test fails 60 days before it) |
| `/ui`'s demos and sample pool | `src/components/showcase/` (one file per group) and `src/constants/showcase.ts` |
| Any other page's copy | `src/app/<path>/page.tsx` |

The logos, icons, link preview, palette and repo banners in `public/brand/` and `src/app/` are generated by [@haruhimemoe/brand](https://github.com/haruhimemoe/brand). [CONTRIBUTING.md](./CONTRIBUTING.md#brand-files) shows how to regenerate them. The swatch hex values come from `@haruhimemoe/brand/palette` at the hue in the generated `public/brand/haruhime-palette.json`, and tests check them against that file and the [@haruhimemoe/ui](https://github.com/haruhimemoe/ui) theme, so colors change upstream, not in `brand.ts`.

## Contributing

Found a problem with the site? Open an [issue](https://github.com/haruhimemoe/haruhime.moe/issues), or see [CONTRIBUTING.md](./CONTRIBUTING.md) to send a fix. Report security problems privately through GitHub's [private vulnerability reporting](https://github.com/haruhimemoe/haruhime.moe/security/advisories/new) or to haruhime@haruhime.moe ([SECURITY.md](./SECURITY.md)). Changes are listed in [CHANGELOG.md](./CHANGELOG.md).

## License

MIT, see [LICENSE](./LICENSE). osu! is a trademark of ppy Pty Ltd; this site isn't affiliated with or endorsed by ppy.
