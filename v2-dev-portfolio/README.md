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

All copy lives in typed files under `data/`:

- `data/site.ts`: name, domain, socials, email, about page copy. **Replace the placeholder handles and email.**
- `data/career.ts`, `data/work.ts`, `data/blogs.ts`, `data/memories.ts`

Memory photos: drop a 4:3 image in `public/memories/` and set `image: "/memories/<file>.jpg"` on the entry.

Set `NEXT_PUBLIC_SITE_URL` in production if the site is not served from `https://dhrutinandan.space`. Canonical URLs, the sitemap and JSON-LD all use it.

## SEO

- Per-route `metadata` / `generateMetadata` with canonical URLs, Open Graph and Twitter cards
- Generated OG images (`app/opengraph-image.tsx`, plus one per blog post)
- `sitemap.xml`, `robots.txt`, web manifest, icons
- JSON-LD: `Person` + `WebSite` site-wide, `ProfilePage`, `Blog` / `BlogPosting` + `BreadcrumbList`, project `ItemList`
- Every page is statically prerendered; interactive parts are client islands that receive server-rendered data, so all content is in the initial HTML

## Develop

```bash
npm run dev
```
