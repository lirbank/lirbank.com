interface Talk {
  date: string;
  title: string;
  note?: string;
  venue: string;
  links: { label: string; href: string }[];
}

export const talks: Talk[] = [
  {
    date: "Apr 3, 2025",
    title: "AI x All Things Web",
    venue: "AWS Gen AI Loft, San Francisco, CA",
    links: [
      {
        label: "Presentation deck",
        href: "https://www.figma.com/deck/eJwtTQUnW3Zvy5994vM5qR",
      },
      {
        label: "Event page",
        href: "https://lu.ma/9dga4f43",
      },
      {
        label: "All Things Web",
        href: "https://allthingsweb.dev/2025-04-03-ai-x-all-things-web",
      },
    ],
  },
  {
    date: "Dec 2, 2024",
    title: "SpikeGadgets",
    note: "private event",
    venue: "SpikeGadgets HQ, San Francisco, CA",
    links: [
      {
        label: "Presentation deck",
        href: "https://www.figma.com/deck/qUZ9ZiFV0RQfYUMdWjeFBf",
      },
      {
        label: "Website",
        href: "https://spikegadgets.com/",
      },
    ],
  },
];
