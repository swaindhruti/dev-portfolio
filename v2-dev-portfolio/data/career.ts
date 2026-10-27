export type Role = {
  hash: string;
  from: string;
  to: string;
  title: string;
  company: string;
  place: string;
  type: string;
  points: string[];
  stack: string[];
};

export const roles: Role[] = [
  {
    hash: "a3f9c21",
    from: "2024",
    to: "present",
    title: "Software Engineer II",
    company: "Northwind",
    place: "Bengaluru",
    type: "full-time",
    points: [
      "Lead the rebuild of the customer dashboard in Next.js, cutting load time by half.",
      "Own the billing API — design reviews, on-call, and the migration off a legacy monolith.",
    ],
    stack: ["typescript", "react", "next.js", "node", "postgres", "aws"],
  },
  {
    hash: "7e1b04d",
    from: "2022",
    to: "2024",
    title: "Software Engineer",
    company: "Lumen Labs",
    place: "Remote",
    type: "full-time",
    points: [
      "Built event pipelines on Kafka processing ~2M events a day.",
      "Wrote internal gRPC services in Go and the tooling to deploy them.",
    ],
    stack: ["go", "grpc", "kafka", "docker", "kubernetes", "postgres"],
  },
  {
    hash: "2c8d5fa",
    from: "2021",
    to: "2022",
    title: "Software Engineering Intern",
    company: "Fieldnote",
    place: "Pune",
    type: "internship",
    points: [
      "Shipped my first production feature: collaborative notes with live cursors.",
      "Learned to write tests before being asked to.",
    ],
    stack: ["python", "django", "react", "redis"],
  },
];

export const stack: Record<string, string[]> = {
  languages: ["typescript", "javascript", "go", "python", "sql"],
  frontend: ["react", "next.js", "tailwind"],
  backend: ["node", "django", "grpc", "kafka", "redis", "postgres"],
  infra: ["docker", "kubernetes", "aws", "git"],
};
