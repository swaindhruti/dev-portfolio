import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected backend, AI and full-stack engineering projects by Dhrutinandan Swain, including PharmaStock, Clinqo, NutriScan and Plastrack.",
  alternates: { canonical: "/work" },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
