// Speaking engagements, in curated display order (not chronological).
interface Talk {
  date: string;
  title: string;
  href: string;
  note?: string;
  venue: string;
  links: { label: string; href: string }[];
}

export const talks: Talk[] = [
  {
    date: "Apr 3, 2025",
    title: "AI x All Things Web",
    href: "https://allthingsweb.dev/2025-04-03-ai-x-all-things-web",
    note: "confirmed",
    venue: "AWS Gen AI Loft, San Francisco, CA",
    links: [
      { label: "Register", href: "https://lu.ma/9dga4f43?tk=QkmdTN" },
      {
        label: "Presentation deck",
        href: "https://www.figma.com/deck/eJwtTQUnW3Zvy5994vM5qR",
      },
    ],
  },
  {
    date: "Dec 2, 2024",
    title: "SpikeGadgets",
    href: "https://spikegadgets.com/",
    note: "private event",
    venue: "SpikeGadgets HQ, San Francisco, CA",
    links: [
      {
        label: "Presentation deck",
        href: "https://www.figma.com/deck/qUZ9ZiFV0RQfYUMdWjeFBf",
      },
    ],
  },
  {
    date: "Feb 25, 2025",
    title: "All Things Web",
    href: "https://allthingsweb.dev/2025-02-25-all-things-web-at-sentry",
    note: "rescheduled",
    venue: "Sentry HQ, San Francisco, CA",
    links: [],
  },
  {
    date: "Mar 2025, TBA",
    title: "Silicon Valley AI Think Tank",
    href: "https://lu.ma/JTA",
    venue: "Menlo Park, CA",
    links: [],
  },
];
