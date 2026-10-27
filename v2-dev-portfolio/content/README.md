# Content

Everything on the Career, Work, Blogs and Memories pages comes from the JSON files in this folder.
Add, edit or delete entries here; no code changes needed. Career, Blogs and Memories sort newest
first whatever order the file is in; Work keeps the order of its file.

After editing, `npm run dev` picks up the change on save. Mistakes are caught for you:

- a missing field or wrong type (e.g. `"read": "6"` instead of `6`) fails `npm run build` (and
  `npx tsc --noEmit`) with an error in `data/<name>.ts` naming the bad field;
- a duplicate `id` / `slug` stops the page with `content/<name>.json: duplicate …`.

## `career.json`

```json
{
  "roles": [
    {
      "id": "acme",                 // unique, any short name
      "from": "2024",
      "to": "present",              // "present" marks the current role (HEAD)
      "title": "Software Engineer",
      "company": "Acme",
      "place": "Bengaluru",
      "type": "full-time",          // full-time, internship, contract…
      "points": ["Cut p95 latency 300ms → 33ms.", "Another short, metric-first line."]
    }
  ],
  "stack": {
    "backend": ["node", "django"],    // the "./stack" list beside the timeline; add or rename groups freely
    "data": ["postgres", "redis"]
  }
}
```

Keep `points` to one short line each, leading with the metric.

## `work.json`

```json
{
  "projects": [
    {
      "id": "my-project",           // unique
      "name": "my-project",         // shown in the list; also used for the "$ open ./my-project" line
      "year": "2026",
      "kind": "personal",           // personal, hackathon, work…
      "summary": "One line in the list.",
      "desc": "A few sentences shown when the project is selected.",
      "stack": ["typescript", "react"],
      "links": [                    // shown as "live ↗  source ↗", in this order; [] for none
        { "label": "live", "href": "https://example.com" },
        { "label": "source", "href": "https://github.com/you/my-project" }
      ]
    }
  ]
}
```

Projects appear on `/work` in the same order as this file, so put the one you want first at the top.
Name links whatever reads best (`web`, `mobile`, `server`, `case study`, `demo`…); label the running
app `live` so search engines get it as the project's URL. GitHub and GitLab links are also shared
with search engines as the project's code.

## `blogs.json`

Each post either **links out** (`url`, e.g. your X article) or is **written here** (`body`, served
at `/blogs/<slug>`). Give it one or the other.

```json
{
  "posts": [
    {
      "slug": "commit-or-rollback",  // unique, lowercase-with-dashes
      "date": "2026-08-13",          // YYYY-MM-DD
      "read": 6,                     // minutes, a number
      "title": "Post title",
      "tags": ["db", "backend"],     // one or more categories; each becomes a #filter
      "excerpt": "One short line shown in the list.",
      "url": "https://x.com/D_SwainX/status/…"   // links out, opens in a new tab (↗)
    },
    {
      "slug": "written-here",
      "date": "2026-11-01",
      "read": 4,
      "title": "A post hosted on this site",
      "tags": ["ai"],
      "excerpt": "One short line shown in the list.",
      "body": ["First paragraph.", "Second paragraph."]   // gets its own page (→)
    }
  ]
}
```

Suggested categories: `backend`, `system-design`, `db`, `ai`. Spell a tag the same way on every post
and its filter groups them; a new tag appears as a filter automatically.

Changing the `slug` of a post written here changes its URL, so old links to it will 404.

## `memories.json`

```json
{
  "memories": [
    {
      "id": "mem-something",        // unique
      "date": "2026-08-17",         // YYYY-MM-DD
      "type": "hackathon",          // hackathon, conference, meetup, milestone…
      "title": "Short title",
      "place": "Bengaluru",
      "note": "A sentence or two.",
      "image": "https://ik.imagekit.io/devdsfolio/dev-folio-memories/something.png"   // optional
    }
  ]
}
```

Photos look best at 4:3 and are cropped to fill the frame. Use an ImageKit link under
`ik.imagekit.io/devdsfolio/` (other hosts are blocked; add them to `images.remotePatterns` in
`next.config.ts`), or a file in `public/memories/` as `/memories/<file>`. Without `image`, the ring
shows an empty frame with the date.

> JSON doesn't allow comments. The `//` notes above are only for this guide; leave them out of
> the real files.
