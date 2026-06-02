/**
 * OG image endpoint — generates PNG share cards at build time
 *
 * Astro calls getStaticPaths() to enumerate all articles, then hits GET()
 * for each one. Satori renders HTML/CSS to SVG, Sharp converts to PNG.
 *
 * Output: /og/{slug}.png (same URLs the article layout already references)
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { createArticleMarkup } from "../../lib/og";
import { logoPromise, renderToPng } from "../../lib/og-render";

/**
 * Enumerate all articles to generate the static paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection("articles");
  return articles.map((article) => ({
    params: { slug: article.id },
    props: {
      title: article.data.title ?? article.id,
      description: article.data.description ?? "",
    },
  }));
};

/**
 * The API route that generates the OG image
 */
export const GET: APIRoute = async ({ props }) => {
  const logo = await logoPromise;
  const markup = createArticleMarkup(props.title, props.description, logo);
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
