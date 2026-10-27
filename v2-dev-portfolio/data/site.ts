export const site = {
  name: "Dhrutinandan Swain",
  shortName: "dhruti",
  domain: "dhrutinandan.space",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhrutinandan.space").replace(/\/$/, ""),
  role: "software engineer",
  tagline: "I put feelings into words, Claude turns them into code.",
  description:
    "Dhrutinandan Swain is a software engineer in Bengaluru working on the layer where systems meet people — APIs, interfaces, and the tooling in between.",
  location: { city: "Bengaluru", country: "India" },
  timeZone: "Asia/Kolkata",
  // TODO: replace the placeholder handles and email with your real ones.
  twitterHandle: "@dhrutinandan",
  email: "hello@dhrutinandan.space",
  socials: [
    { label: "twitter", href: "https://x.com/dhrutinandan" },
    { label: "github", href: "https://github.com/dhrutinandan" },
    { label: "email", href: "mailto:hello@dhrutinandan.space" },
  ],
} as const;

export const nav = [
  { idx: "01", label: "career", href: "/career" },
  { idx: "02", label: "about", href: "/about" },
  { idx: "03", label: "blogs", href: "/blogs" },
  { idx: "04", label: "memories", href: "/memories" },
] as const;

export const about = {
  headline: "Dhrutinandan Swain — software engineer",
  lead: "I like the layer where systems meet people — APIs, interfaces, and the tooling in between.",
  body: "Most days I'm turning vague ideas into things that ship, then making them faster. Outside work I'm usually taking something apart to see how it works.",
  hobbies: ["lego maniac", "sketching", "reading books"],
  reading: { title: "Designing Data-Intensive Applications", author: "martin kleppmann" },
  env: [
    { label: "location", value: "Bengaluru, India" },
    { label: "education", value: "NIT Rourkela · 2027" },
    { label: "currently", value: "software engineer @ northwind" },
    { label: "status", value: "open to interesting problems" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
