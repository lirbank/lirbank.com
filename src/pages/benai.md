---
layout: ../layouts/page.astro
---

![BenAi logo](/benai/benai-logo.png)

# BenAi

**Navigating Healthcare, Simplified**

BenAI is a next-generation customer service platform we developed to transform how members understand and interact with their healthcare plans. By combining cutting edge AI with clean UX, BenAI helps members maximize their benefits, reduces administrative load, and enhances support quality for healthcare administrators.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/7qGNruhM2nE"
  frameborder="0"
  allowfullscreen
></iframe>

## What we built

- AI chatbot for plan-specific Q&A
- Centralized hub for docs & benefits
- Admin tools for TPA workflows
- Plan comparison & scenario planning
- Scalable, secure, and compliant

## Outcomes

- Instant answers to member questions
- Less load on customer service teams
- Smarter plan usage by members
- Faster onboarding for new groups
- Happier members, fewer escalations

## Agentic Architecture

![BenAI system diagram](/benai/benai-agent-framework.png)

We created a modular agent framework to enable intelligent data retrieval and workflow execution. A central Routing Agent dynamically selects specialized sub-agents—such as Plan Context, Claim Status, and Doctor Network Agents—based on the user's question.

These agents fetch information from relevant data sources (e.g. Group Data, Claims API, Doctor Network) and return structured context to a Summarizer, which formulates a precise, user-facing response. The system is designed for scalability, supporting easy integration of future agents and APIs.
