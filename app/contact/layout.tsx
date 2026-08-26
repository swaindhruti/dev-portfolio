import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dhrutinandan Swain for freelance backend, AI and full-stack engineering work — email, GitHub, X, LinkedIn and more.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
