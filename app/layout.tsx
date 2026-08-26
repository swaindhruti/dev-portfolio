import type { Metadata } from "next";
import localFont from "next/font/local";
import Navigation from "@/components/Navigation";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

const displayFont = localFont({
  src: "./fonts/Manuka-TextBlack.otf",
  variable: "--font-manuka",
  weight: "900",
});

const faktum = localFont({
  src: "./fonts/Faktum-Regular.otf",
  variable: "--font-faktum",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dhrutinandan.space'),
  title: {
    default: "Dhrutinandan Swain | Backend, AI & Full-Stack Engineer",
    template: "%s | Dhrutinandan Swain",
  },
  description: "Dhrutinandan Swain is a self-taught Backend, AI and Full-Stack Engineer based in Odisha, India, available for freelance work.",
  keywords: ["Backend Engineer", "AI Engineer", "Full-Stack Engineer", "Freelance Software Engineer", "Next.js", "Node.js", "Dhrutinandan Swain"],
  authors: [{ name: "Dhrutinandan Swain", url: "https://dhrutinandan.space" }],
  creator: "Dhrutinandan Swain",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dhrutinandan.space",
    title: "Dhrutinandan Swain | Backend, AI & Full-Stack Engineer",
    description: "Self-taught Backend, AI and Full-Stack Engineer based in Odisha, India, available for freelance work.",
    siteName: "Dhrutinandan Swain",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhrutinandan Swain | Backend, AI & Full-Stack Engineer",
    description: "Self-taught Backend, AI and Full-Stack Engineer based in Odisha, India, available for freelance work.",
    creator: "@D_SwainX",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${faktum.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-faktum">
        <StructuredData />
        <Navigation />
        {children}
        {modal}
      </body>
    </html>
  );
}
