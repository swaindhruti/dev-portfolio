import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Notes and writing by Dhrutinandan Swain on software engineering, backend systems and web3, published on Medium.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
