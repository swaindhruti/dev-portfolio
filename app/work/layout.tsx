import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected full-stack, AI and platform engineering projects by Dhrutinandan Swain, including PharmaStock, CLinqer, Nutriscan, Plastrack and D2A Studio.",
  alternates: { canonical: "/work" },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
