interface Project {
  title: string;
  description: string;
  links: { label: string; href: string }[];
  testimonial?: string; // id in the testimonials collection
}

export const projects: Project[] = [
  {
    title: "Coupa",
    description:
      "Coupa is a leader in business spend management. They brought me in to set the architecture for their supplier agent and build it out. It’s an email-native AI agent on AWS Bedrock and LangChain, with evals guarding its behavior as it evolves. Suppliers email it the way they’d email a person, and it replies in the same email thread. It answers questions about invoices and purchase orders, and takes action too, like creating and sending invoices.",
    links: [{ label: "coupa.com", href: "https://www.coupa.com/" }],
  },
  {
    title: "Databricks",
    description:
      "Lakebase is Databricks’ serverless Postgres. I’m designing their data anonymization workflow, where engineers branch production, mask the sensitive data with join-preserving transforms, and verify nothing leaks before restricted teams get access to the anonymized branch. It ships as an agent skill, so a coding agent can walk any engineer through it.",
    links: [
      {
        label: "Lakebase",
        href: "https://www.databricks.com/product/lakebase",
      },
    ],
  },
  {
    title: "Neon",
    description:
      "Neon is serverless Postgres. I build developer-facing AI tooling for them, including an open-source agent skill that helps coding agents catch costly egress patterns, evals that measure how agents perform with and without it, and reference examples pairing Neon branches with preview deployments.",
    links: [
      {
        label: "Egress Optimizer skill",
        href: "https://github.com/neondatabase/agent-skills/tree/main#neon-postgres-egress-optimizer",
      },
      {
        label: "Skill evals",
        href: "https://github.com/neondatabase/agent-skills/tree/main/evals/neon-postgres-egress-optimizer",
      },
      {
        label: "Preview branches example",
        href: "https://github.com/neondatabase/preview-branches-with-cloudflare",
      },
    ],
  },
  {
    title: "Scoutbee",
    description:
      "Scoutbee builds AI-powered supplier discovery for procurement teams. I built Instant Supplier Search (ISS) as a skunkworks project, letting Fortune 50 buyers find and evaluate suppliers across any category with natural-language queries and rich filtering. I then worked on Aura, the next generation of the product. Scoutbee was later acquired by Coupa.",
    links: [
      { label: "ISS demo", href: "https://scoutbee-iss.vercel.app/" },
      { label: "scoutbee.com", href: "https://www.scoutbee.com/" },
    ],
    testimonial: "gregor-stuhler",
  },
  {
    title: "BenAi",
    description:
      "BenAi is an AI-first chatbot for health benefits administrators (TPAs). They brought me in to take the platform from prototype to production. BenAi ingests plan documents and claims data at the individual member level, using LLMs and custom embeddings to give call center agents accurate, member-specific answers on claims and coverage, cutting call times and escalations.",
    links: [{ label: "Case study", href: "/benai" }],
    testimonial: "spencer-smith",
  },
  {
    title: "BootstrapLabs, an Ares company",
    description:
      "BootstrapLabs is a venture capital firm with an applied AI venture studio, where I led a team of four building Shorty, an AI-augmented communication platform. It organizes conversations and interactions into a graph, and relies on AI agents to identify consensus points and support decision making, bringing every conversation to a conclusion as quickly as possible.",
    links: [{ label: "shorty.run", href: "https://shorty.run/" }],
    testimonial: "victor-meyer",
  },
  {
    title: "Teledyne FLIR",
    description:
      "Teledyne FLIR is the world leader in thermal imaging cameras. Years before today’s LLMs, I built Conservator, their data lifecycle management platform for teams training neural networks. It takes video uploads in any format from FLIR offices around the world, splits them into frames, and provides annotation and versioned training datasets. Annotations made by the models come back into the tool for correction, closing the loop for the next round of training. What started as an internal tool is now sold as an OEM product.",
    links: [
      { label: "Conservator", href: "https://www.flirconservator.com/" },
      {
        label: "OEM product page",
        href: "https://www.flir.com/oem/conservator/",
      },
    ],
    testimonial: "justin-muncaster",
  },
];
