import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";

export async function getStaticPaths() {
  const articles = await getCollection("articles");
  return articles.map((article) => ({
    params: { slug: article.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const entry = await getEntry("articles", params.slug!);
  if (!entry?.body) return new Response("Not found", { status: 404 });

  return new Response(entry.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
