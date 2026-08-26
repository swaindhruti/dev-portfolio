import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Community involvement and hackathons by Dhrutinandan Swain — OpenCode NIT Rourkela, Google Developer Groups, AWS Cloud Clubs and HackNITR.",
  alternates: { canonical: "/community" },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
