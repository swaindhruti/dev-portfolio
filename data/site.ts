export const site = {
  name: "Dhrutinandan Swain",
  shortName: "dhruti",
  domain: "dhrutinandan.space",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhrutinandan.space"
  ).replace(/\/$/, ""),
  /** Shown on the home screen. */
  role: "backend & ai engineer",
  /** Used in page titles, link previews and structured data. */
  jobTitle: "Backend, AI & Full-Stack Engineer",
  tagline: "I put feelings into words, Claude turns them into code.",
  // Search results show ~155 characters; keep the important part first.
  description:
    "Backend, AI and full-stack engineer building Go and Python backends, RAG systems and Next.js apps. Open for freelance software development and UI/UX design.",
  /** Freelance work on offer, for structured data and the About page. */
  services: ["Freelance software development", "UI/UX design"],
  location: { region: "Odisha", country: "India" },
  timeZone: "Asia/Kolkata",
  twitterHandle: "@D_SwainX",
  email: "dhrutinandan.dev@gmail.com",
  socials: [
    { label: "twitter", href: "https://x.com/D_SwainX" },
    { label: "github", href: "https://github.com/swaindhruti" },
    { label: "email", href: "mailto:dhrutinandan.dev@gmail.com" },
  ],
} as const;

export const nav = [
  { idx: "01", label: "career", href: "/career" },
  { idx: "02", label: "work", href: "/work" },
  { idx: "03", label: "about", href: "/about" },
  { idx: "04", label: "blogs", href: "/blogs" },
  { idx: "05", label: "memories", href: "/memories" },
] as const;

export const about = {
  headline: "Dhrutinandan Swain",
  lead: "Backend and AI engineer, mining engineer by degree. I still dig — just through databases now.",
  body: "I post on X, I'm working my way through every cuisine and delicacy the world has to offer, and I build drones when the mood strikes.",
  hobbies: ["lego maniac", "sketching", "reading books"],
  reading: {
    title: "Designing Data-Intensive Applications",
    author: "martin kleppmann",
  },
  env: [
    { label: "location", value: "Odisha, India" },
    { label: "education", value: "NIT Rourkela · 2027" },
    { label: "currently", value: "SDE @ clinqo" },
    { label: "status", value: "open for freelance · software & ui/ux" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
