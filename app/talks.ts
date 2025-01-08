type Talk = {
  date: string;
  title: string;
  url: string;
  isPublic: boolean;
  location: string;
};

export const talks = [
  {
    date: "December 2, 2024",
    title: "SpikeGadgets",
    url: "https://spikegadgets.com/",
    isPublic: false,
    location: "SpikeGadgets HQ, San Francisco, CA",
  },
  {
    date: "Feb 25, 2025",
    title: "All Things Web",
    url: "https://allthingsweb.dev/",
    isPublic: true,
    location: "Sentry HQ, San Francisco, CA",
  },
  {
    date: "March, 2025 (date TBA)",
    title: "Silicon Valley AI Think Tank",
    url: "https://lu.ma/JTA",
    isPublic: true,
    location: "Menlo Park, CA",
  },
] satisfies Talk[];
