export type Project = {
  id: string;
  name: string;
  year: string;
  kind: string;
  summary: string;
  desc: string;
  stack: string[];
  /** Leave empty to hide the link. */
  live: string;
  source: string;
};

// TODO: replace the "#" live/source placeholders with real URLs.
export const projects: Project[] = [
  {
    id: "work-site",
    name: "dhrutinandan.space",
    year: "2026",
    kind: "personal",
    summary: "This site — hands, a handshake and a name, drawn in nine characters.",
    desc: "A portfolio rendered almost entirely in text. The intro turns a density map of two hands into a live canvas of characters that point, shake and dissolve into my name.",
    stack: ["canvas", "javascript", "react"],
    live: "#",
    source: "#",
  },
  {
    id: "work-voicegit",
    name: "voice-git",
    year: "2026",
    kind: "hackathon",
    summary: "A git client you talk to. Built in 36 hours.",
    desc: 'Say "stage everything and commit with message fix login" and it does. Speech-to-intent with a small grammar, mapped onto real git commands with a confirm step for anything destructive.',
    stack: ["typescript", "node", "web speech api"],
    live: "",
    source: "#",
  },
  {
    id: "work-lagwatch",
    name: "lagwatch",
    year: "2025",
    kind: "open source",
    summary: "A tiny CLI that tells you why your Kafka consumers are behind.",
    desc: "Born from a 2am incident. Reads consumer group offsets, partition skew and rebalance history, then prints a plain-English diagnosis instead of a wall of numbers.",
    stack: ["go", "kafka"],
    live: "",
    source: "#",
  },
  {
    id: "work-ledger",
    name: "ledger dashboard",
    year: "2024",
    kind: "work",
    summary: "Rebuilt the customer billing dashboard at Northwind.",
    desc: "Moved a slow server-rendered dashboard to Next.js with streaming data, cutting load time by half. Led the design review and the gradual rollout.",
    stack: ["next.js", "typescript", "postgres"],
    live: "#",
    source: "",
  },
];
