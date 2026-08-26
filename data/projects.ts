export interface Project {
  id: string;
  title: string;
  category: "Backend" | "Full Stack";
  tagline: string;
  description: string;
  role: string;
  techStack: string[];
  links: { label: string; url: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: "pharmastock",
    title: "PharmaStock",
    category: "Backend",
    tagline: "B2B Pharmaceutical Stock Discovery Platform",
    description: "B2B pharmaceutical stock management platform connecting stockists and retailers - stockists upload inventory files, the system processes them into a searchable catalog so retailers can instantly find which distributors carry the medicines they need.",
    role: "Backend Engineer",
    techStack: ["Go", "Echo", "PostgreSQL", "pgvector", "Nginx", "Worker Pools"],
    links: [
      { label: "Case Study", url: "https://swaindhruti.github.io/project-case-studies/projects/pharmastock.html" },
      { label: "GitHub", url: "https://github.com/swaindhruti/pharmastock-backend" },
    ],
  },
  {
    id: "clinqo",
    title: "Clinqo",
    category: "Full Stack",
    tagline: "Event-Driven Hospital Management System",
    description: "Scalable, event-driven Hospital Management System automating clinic workflows, WhatsApp communications, idempotent webhooks, and distributed BullMQ job processing for real-time patient care coordination.",
    role: "Lead Backend Engineer",
    techStack: ["Python", "Django", "Next.js", "PostgreSQL", "Redis", "BullMQ", "Groq", "WhatsApp API"],
    links: [
      { label: "Case Study", url: "https://swaindhruti.github.io/project-case-studies/projects/clinqo.html" },
    ],
  },
  {
    id: "nutriscan",
    title: "NutriScan",
    category: "Full Stack",
    tagline: "AI-Powered Nutrition Analysis Platform",
    description: "AI-powered nutrition analysis platform enabling barcode scanning, personalized health scoring, and Gemini-driven diet recommendations - built at Hack4Bengal Season 4 with real-time OpenFoodFacts integration and Hindi TTS accessibility. A collaborative team build (3 contributors), not a solo project.",
    role: "Backend & AI Engineer",
    techStack: ["Go", "Gin", "MongoDB", "Next.js", "TypeScript", "Gemini AI", "TailwindCSS"],
    links: [
      { label: "GitHub", url: "https://github.com/ayussh-2/project-amobagan" },
      { label: "Demo Video", url: "https://youtu.be/WaJyNxkrd2o?si=hH_qeVmHhCybqtSZ" },
    ],
  },
  {
    id: "plastrack",
    title: "Plastrack",
    category: "Full Stack",
    tagline: "AI Waste Classification & Mapping Platform",
    description: "AI-powered waste management platform using computer vision to identify and classify waste, suggest sustainable disposal methods, and map waste hotspots for municipalities - with gamified community engagement across web and mobile.",
    role: "Backend & AI Engineer",
    techStack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Nuxt.js", "Flutter", "Google Cloud Vision", "Gemini AI", "GCP Cloud Run"],
    links: [
      { label: "GitLab", url: "https://gitlab.com/dhrut.24.swain/waste-2-way" },
      { label: "Demo", url: "https://waste-2-way.vercel.app" },
    ],
  },
];

export function getProjectNav(slug: string) {
  const index = PROJECTS.findIndex((p) => p.id === slug);
  if (index === -1) return null;
  return {
    project: PROJECTS[index],
    index,
    prev: PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length],
    next: PROJECTS[(index + 1) % PROJECTS.length],
  };
}
