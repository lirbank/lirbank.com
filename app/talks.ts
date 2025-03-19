type Talk = {
  date: string;
  title: string;
  url: string;
  ticketUrl?: string;
  isPublic: boolean;
  location: string;
  status?: "cancelled" | "postponed" | "rescheduled" | "confirmed";
  host?: { name: string; url: string; location: string };
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
    url: "https://allthingsweb.dev/2025-02-25-all-things-web-at-sentry",
    isPublic: true,
    location: "Sentry HQ, San Francisco, CA",
    host: {
      name: "Sentry HQ",
      url: "https://sentry.io/",
      location: "San Francisco, CA",
    },
    status: "rescheduled",
  },
  {
    date: "Apr 5, 2025",
    title: "AI x All Things Web",
    url: "https://allthingsweb.dev/2025-04-03-ai-x-all-things-web",
    ticketUrl: "https://lu.ma/9dga4f43?tk=QkmdTN",
    isPublic: true,
    location: "AWS GenAI Loft, San Francisco, CA",
    host: {
      name: "AWS GenAI Loft",
      url: "https://aws.amazon.com/startups/lp/aws-gen-ai-loft-san-francisco",
      location: "San Francisco, CA",
    },
    status: "confirmed",
  },
  {
    date: "March, 2025 (date TBA)",
    title: "Silicon Valley AI Think Tank",
    url: "https://lu.ma/JTA",
    isPublic: true,
    location: "Menlo Park, CA",
  },
] satisfies Talk[];
