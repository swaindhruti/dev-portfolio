# dhrutinandan.space — v2

A terminal-styled developer portfolio, built from the Claude Design handoff with Next.js 16 (App Router, Cache Components, Partial Prefetching) and Tailwind CSS v4.

## Routes

| Route | What it is |
| --- | --- |
| `/` | ASCII handshake intro → name canvas, tagline, CTAs |
| `/career` | `git log` timeline with a hoverable stack index |
| `/about` | `whoami` profile with live IST clock |
| `/work` | `tree`-style project browser (↑ / ↓ to browse) |
| `/blogs`, `/blogs/[slug]` | Tag-filterable post list and statically generated posts |
| `/memories` | Drag-to-spin photo ring |

## Editing content

- **Career, Work, Blogs, Memories:** plain JSON in `content/` (`career.json`, `work.json`, `blogs.json`, `memories.json`). Add, edit or delete entries there; no code changes. See `content/README.md` for every field.
- **Name, links, about page:** `data/site.ts`.

Memory photos: drop a 4:3 image in `public/memories/` and set `"image": "/memories/<file>.jpg"` on the entry.

Set `NEXT_PUBLIC_SITE_URL` in production if the site is not served from `https://dhrutinandan.space`. Canonical URLs, the sitemap and JSON-LD all use it.

To verify the site in Google Search Console, pick the "HTML tag" method and set
`GOOGLE_SITE_VERIFICATION` to the `content` value Google shows; the meta tag is added for you.
Then submit `https://dhrutinandan.space/sitemap.xml` there.

## SEO

- Per-route `metadata` / `generateMetadata` with canonical URLs, Open Graph and Twitter cards
- Link-preview image `public/og.jpg` (1200×630, a home-screen screenshot; replace the file to update it), plus a generated one per on-site blog post
- `sitemap.xml`, `robots.txt`, web manifest, icons
- JSON-LD: `Person` + `WebSite` site-wide, `ProfilePage`, `Blog` / `BlogPosting` + `BreadcrumbList`, project `ItemList`
- Every page is statically prerendered; interactive parts are client islands that receive server-rendered data, so all content is in the initial HTML

## Develop

```bash
npm run dev
```
