import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

export async function getStaticPaths() {
  const articles = await getCollection("articles");
  return articles.map((article) => ({
    params: { slug: article.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const filePath = path.join(
    process.cwd(),
    "src/content/articles",
    `${params.slug}.md`,
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
