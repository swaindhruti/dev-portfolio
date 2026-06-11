import type { Metadata } from "next";
import localFont from "next/font/local";
import FloatingContact from "@/components/FloatingContact";
import Navigation from "@/components/Navigation";
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
    default: "Dhrutinandan Swain | Developer & Designer",
    template: "%s | Dhrutinandan Swain",
  },
  description: "Creative developer and digital product designer crafting architectural, neo-brutalist web experiences.",
  keywords: ["Frontend Developer", "Web Designer", "Creative Developer", "Next.js", "React", "Portfolio", "Dhrutinandan Swain"],
  authors: [{ name: "Dhrutinandan Swain" }],
  creator: "Dhrutinandan Swain",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dhrutinandan.space",
    title: "Dhrutinandan Swain | Creative Developer",
    description: "Creative developer and digital product designer crafting architectural web experiences.",
    siteName: "Dhrutinandan Swain Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dhrutinandan Swain Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhrutinandan Swain | Creative Developer",
    description: "Creative developer and digital product designer crafting architectural web experiences.",
    creator: "@D_SwainX",
    images: ["/og-image.jpg"],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${faktum.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-faktum">
        <Navigation />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
