<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- **Link-preview image:** whenever `public/og.jpg` is replaced or edited, bump the `?v=` number on its URL in `lib/og.tsx` (e.g. `/og.jpg?v=2` → `/og.jpg?v=3`) in the same change. WhatsApp, X, LinkedIn, Slack, Discord etc. cache preview images by URL, so keeping the same URL keeps showing the old card.
