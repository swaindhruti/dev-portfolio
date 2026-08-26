export interface Project {
  id: string;
  num: string;
  title: string;
  category: "FULL STACK" | "APP" | "PLATFORM";
  tagline: string;
  description: string;
  fullOverview: string;
  keyFeatures: string[];
  timeline: string;
  role: string;
  techStack: string[];
  codeLink: string;
  demoLink: string;
}

export const PROJECTS: Project[] = [
  {
    id: "pharmastock",
    num: "01",
    title: "PharmaStock",
    category: "FULL STACK",
    tagline: "Pharmacy Inventory & Batch Expiration Engine",
    description: "A robust full-stack inventory management solution built for pharmacy workflows, featuring real-time batch expiration alerts, automated re-order triggers, and multi-tenant database isolation.",
    fullOverview: "PharmaStock was engineered to solve high-stakes pharmacy inventory bottlenecks. It processes live stock movements, automatically calculates batch expiration risk scores, and triggers instant supplier re-orders via automated background queues. Built with Next.js 15, PostgreSQL, and Redis cache for sub-10ms query responses.",
    keyFeatures: [
      "Real-time batch expiration risk matrix & automated alerts",
      "Multi-tenant database isolation for multi-branch pharmacies",
      "Supplier automated re-order queue & PDF invoice generator",
      "Role-based access control (Pharmacists, Admins, Audit Auditors)"
    ],
    timeline: "2023 - PRESENT",
    role: "Lead Full Stack Architect",
    techStack: ["Next.js 15", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Redis"],
    codeLink: "https://github.com/swaindhruti",
    demoLink: "https://github.com/swaindhruti",
  },
  {
    id: "clinqer",
    num: "02",
    title: "CLinqer",
    category: "FULL STACK",
    tagline: "Automated Technical Pipeline & Field Analytics",
    description: "An innovative full-stack platform designed to streamline automated technical workflows, featuring distributed microservice processing, real-time WebSocket telemetry, and visual analytics.",
    fullOverview: "CLinqer bridges field data collection with cloud analytics pipelines. Field engineers record live technical metrics that stream directly into microservices workers for automated anomaly detection and visualization.",
    keyFeatures: [
      "Distributed microservices worker queue processing",
      "Real-time WebSocket telemetry charts and threshold alerts",
      "Automated field inspection report generator",
      "Role-based team workspaces with live co-editing"
    ],
    timeline: "2023",
    role: "Full Stack Engineer",
    techStack: ["React", "Express", "MongoDB", "Python", "WebSockets", "Docker"],
    codeLink: "https://github.com/swaindhruti",
    demoLink: "https://github.com/swaindhruti",
  },
  {
    id: "nutriscan",
    num: "03",
    title: "Nutriscan",
    category: "FULL STACK",
    tagline: "AI Computer Vision Nutritional Scanner",
    description: "A modern full-stack mobile application integrating AI computer vision to scan food ingredients in real time, generate health scores, and deliver instant dietary allergen alerts.",
    fullOverview: "Nutriscan leverages on-device TensorFlow models to instantly OCR ingredient labels on product packaging, cross-referencing them with user allergy profiles and dietary goals to deliver instant warning alerts.",
    keyFeatures: [
      "On-device AI optical character recognition (OCR)",
      "Instant allergen & additive warning alert system",
      "Personalized macro-nutrient scoring algorithm",
      "Offline ingredient database lookup"
    ],
    timeline: "2022 - 2023",
    role: "Mobile & AI Developer",
    techStack: ["React Native", "Firebase", "TensorFlow.js", "Python", "FastAPI"],
    codeLink: "https://github.com/swaindhruti",
    demoLink: "https://github.com/swaindhruti",
  },
  {
    id: "plastrack",
    num: "04",
    title: "Plastrack",
    category: "APP",
    tagline: "Geospatial Asset Tracking & Offline Sync",
    description: "A powerful cross-platform application created to optimize tracking workflows, featuring real-time GPS asset location, offline sync capabilities, and interactive map overlays.",
    fullOverview: "Plastrack provides field personnel with real-time geospatial asset tracking. It operates flawlessly in remote low-connectivity areas by buffering location logs locally in SQLite before performing background delta syncs with cloud endpoints.",
    keyFeatures: [
      "Real-time GPS coordinate logging & map polyline trails",
      "Offline-first SQLite local database with automatic sync",
      "Custom vector map overlays & geofencing alerts",
      "Low-power background location tracking service"
    ],
    timeline: "2022",
    role: "App Engineer",
    techStack: ["Flutter", "Dart", "Firebase", "Google Maps API", "SQLite"],
    codeLink: "https://github.com/swaindhruti",
    demoLink: "https://github.com/swaindhruti",
  },
  {
    id: "d2a-studio",
    num: "05",
    title: "D2A Studio",
    category: "PLATFORM",
    tagline: "3D Asset Management & Collaboration Studio",
    description: "A comprehensive studio platform designed for managing digital assets, featuring web-based 3D asset previewing, versioned file collaboration, and automated rendering queues.",
    fullOverview: "D2A Studio streamlines 3D artist workflows by providing in-browser WebGL model previewing, versioned asset hosting, and automated cloud rendering job distribution.",
    keyFeatures: [
      "In-browser WebGL 3D model viewport & lighting controls",
      "Versioned digital asset management with diff history",
      "Automated cloud render task queue & notification hooks",
      "Client feedback pinning on 3D mesh surfaces"
    ],
    timeline: "2021",
    role: "Frontend & Platform Engineer",
    techStack: ["Vue.js", "Ruby on Rails", "AWS S3", "Three.js", "PostgreSQL"],
    codeLink: "https://github.com/swaindhruti",
    demoLink: "https://github.com/swaindhruti",
  }
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
