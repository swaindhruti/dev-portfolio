export type Memory = {
  id: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  type: string;
  title: string;
  place: string;
  note: string;
  /** Optional photo under /public, e.g. "/memories/mem-hackblr.jpg" (4:3 works best). */
  image?: string;
};

/** Newest first. */
export const memories: Memory[] = [
  {
    id: "mem-hackblr",
    date: "2026-08-17",
    type: "hackathon",
    title: "36 hours, one voice-controlled git client",
    place: "Bengaluru",
    note: "Our team of three shipped a demo at 5am. It only half worked. We still talk about it.",
  },
  {
    id: "mem-first-conf",
    date: "2026-03-09",
    type: "conference",
    title: "My first big tech conference",
    place: "Hyderabad",
    note: "Two days of talks, too much coffee, and a notebook full of things to try.",
  },
  {
    id: "mem-mentor",
    date: "2025-12-02",
    type: "hackathon",
    title: "Mentoring at a college hackathon",
    place: "Pune",
    note: "Sat on the other side of the table for once. Every team asked better questions than I did at their age.",
  },
  {
    id: "mem-devfest",
    date: "2025-11-15",
    type: "conference",
    title: "DevFest, front row",
    place: "Bengaluru",
    note: "Caught the speaker after the talk and asked one question too many. Got an answer anyway.",
  },
  {
    id: "mem-meetup-talk",
    date: "2025-09-20",
    type: "meetup",
    title: "First talk at a local meetup",
    place: "Bengaluru",
    note: "Ten minutes on Kafka consumer lag. My hands were shaking. Nobody noticed.",
  },
  {
    id: "mem-lego-build",
    date: "2025-07-04",
    type: "milestone",
    title: "Finished the 3,000-piece build",
    place: "home",
    note: "Three weekends, one missing piece, found under the couch.",
  },
  {
    id: "mem-oss-meetup",
    date: "2025-04-26",
    type: "meetup",
    title: "Open-source Saturday",
    place: "Bengaluru",
    note: "Paired with a stranger on a bug neither of us understood. We fixed it by lunch.",
  },
  {
    id: "mem-hack-48",
    date: "2024-10-12",
    type: "hackathon",
    title: "48 hours, zero sleep, second place",
    place: "Chennai",
    note: "The judges liked the demo. We liked the free pizza more.",
  },
  {
    id: "mem-first-pr",
    date: "2024-06-11",
    type: "milestone",
    title: "First PR merged into a real open-source project",
    place: "remote",
    note: "Four lines of code and a lot of review comments. Worth every one.",
  },
  {
    id: "mem-sketch-walk",
    date: "2024-02-18",
    type: "meetup",
    title: "Sketch walk with the urban sketchers",
    place: "Mysuru",
    note: "Two hours, one street corner, a page I still keep in my bag.",
  },
];
