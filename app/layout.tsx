import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { roles, stack } from "@/data/career";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { mono } from "@/lib/fonts";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const defaultTitle = `${site.name} — ${site.jobTitle}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Tab names are just the page ("about", "work"…), except home, which is the name. Link previews
  // and structured data still carry the full name and job title (see openGraph / twitter below).
  title: { default: site.name, template: "%s" },
  description: site.description,
  applicationName: site.domain,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    site.name,
    "Dhrutinandan",
    "Dhruti Swain",
    "backend engineer",
    "AI engineer",
    "full-stack engineer",
    "freelance software developer",
    "freelance UI/UX designer",
    "Go",
    "Python",
    "Django",
    "Next.js",
    "React",
    "RAG",
    "LLM",
    "PostgreSQL",
    "NIT Rourkela",
    "India",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.domain,
    title: defaultTitle,
    description: site.description,
    locale: "en_IN",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    creator: site.twitterHandle,
    site: site.twitterHandle,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { email: false, address: false, telephone: false },
  // Search Console ownership: set GOOGLE_SITE_VERIFICATION to the token Google gives you.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark light",
};

const sameAs = site.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href);
const current = roles.find((r) => /present|now/i.test(r.to));

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: site.shortName,
      url: site.url,
      jobTitle: site.jobTitle,
      description: site.description,
      email: `mailto:${site.email}`,
      address: {
        "@type": "PostalAddress",
        addressRegion: site.location.region,
        addressCountry: site.location.country,
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: "National Institute of Technology Rourkela" },
      ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
      knowsAbout: [
        "Backend engineering",
        "AI engineering",
        "Full-stack development",
        "UI/UX design",
        "System design",
        ...Object.values(stack).flat(),
      ],
      // Freelance availability, so search engines can match "hire" style queries.
      makesOffer: site.services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name, provider: { "@id": `${site.url}/#person` } },
      })),
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.domain,
      description: site.description,
      inLanguage: "en",
      author: { "@id": `${site.url}/#person` },
      publisher: { "@id": `${site.url}/#person` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={mono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-50 bg-fg px-3 py-2 font-mono text-xs text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          skip to content
        </a>
        {children}
        <JsonLd data={structuredData} />
      </body>
    </html>
  );
}
