import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { about, site } from "@/data/site";
import { mono } from "@/lib/fonts";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const defaultTitle = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s · ${site.domain}` },
  description: site.description,
  applicationName: site.domain,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    site.name,
    "Dhrutinandan",
    "software engineer",
    "full-stack developer",
    "Bengaluru",
    "TypeScript",
    "Next.js",
    "React",
    "Go",
    "Kafka",
    "portfolio",
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
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    creator: site.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark light",
};

const sameAs = site.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: site.shortName,
      url: site.url,
      jobTitle: "Software Engineer",
      description: about.lead,
      email: `mailto:${site.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressCountry: site.location.country,
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: "National Institute of Technology Rourkela" },
      knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "Go", "Kafka", "PostgreSQL", "Distributed systems"],
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
