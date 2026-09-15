# Dev Portfolio

Personal portfolio site built with [Next.js](https://nextjs.org) (App Router), TypeScript, Tailwind CSS, and GSAP for animations.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `pnpm dev` — start the development server
- `pnpm build` — create a production build
- `pnpm start` — run the production build
- `pnpm lint` — run ESLint

## Project Structure

- `app/` — routes and pages (home, work, blogs, community, contact) using the App Router, including a parallel `@modal` route for the project detail overlay
- `components/` — UI sections (Hero, About, Career, Shows, Navigation, Footer, ProjectModal, etc.)
- `data/projects.ts` — project entries shown on the Work page and in the project modal

## Deploy on Vercel

The site is deployed via the [Vercel Platform](https://vercel.com). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
