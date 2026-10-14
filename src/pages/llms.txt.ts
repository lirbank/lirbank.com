import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { contact } from "../data/contact";
import { homepage } from "../data/homepage";

/**
 * llms.txt is the plain-text index that AI agents read to find the markdown
 * versions of the articles. Format: https://llmstxt.org
 */
export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("astro.config `site` is required for llms.txt");

  const articles = (await getCollection("articles")).sort((a, b) =>
    b.data.published.localeCompare(a.data.published),
  );

  const lines = [
    `# ${homepage.title}`,
    "",
    `> ${homepage.description}`,
    "",
    "Each article is served as markdown at the URL listed below, and as HTML at the same URL without the `.md` extension.",
    "",
    "## Articles",
    "",
    ...articles.map(
      ({ id, data }) =>
        `- [${data.title}](${site.origin}/${id}.md): ${data.description}`,
    ),
    "",
    "## Contact",
    "",
    ...contact.map(({ label, href }) => `- [${label}](${href})`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
