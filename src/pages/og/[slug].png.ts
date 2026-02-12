/**
 * OG image endpoint — generates PNG share cards at build time
 *
 * Astro calls getStaticPaths() to enumerate all blog posts, then hits GET()
 * for each one. Satori renders HTML/CSS to SVG, Sharp converts to PNG.
 *
 * Output: /og/{slug}.png (same URLs the article layout already references)
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { createMarkup, WIDTH, HEIGHT } from "../../lib/og";

// Satori doesn't support woff2, so we can't use the same gstatic URL the
// website loads (see src/styles/fonts.css). Fontsource serves woff which works.
const FONT_URL = "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin";

/**
 * Loads the Inter font from fontsource.org
 */
async function loadFonts() {
  const [regular, bold] = await Promise.all([
    fetch(`${FONT_URL}-400-normal.woff`).then((r) => r.arrayBuffer()),
    fetch(`${FONT_URL}-700-normal.woff`).then((r) => r.arrayBuffer()),
  ]);
  return [
    {
      name: "Inter",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

// Fetched once at build time, shared across all routes
const fontsPromise = loadFonts();

/**
 * Enumerates all blog posts to generate the static paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.md$/, "") },
    props: {
      title: post.data.title ?? post.id,
      description: post.data.description ?? "",
    },
  }));
};

/**
 * Renders the markup to a PNG
 */
async function renderToPng(markup: ReturnType<typeof createMarkup>) {
  const fonts = await fontsPromise;
  const svg = await satori(markup, { width: WIDTH, height: HEIGHT, fonts });
  return (
    sharp(Buffer.from(svg))
      // Double the size to avoid blurring on retina screens (2400 x 1260)
      .resize(WIDTH * 2, HEIGHT * 2)
      .png()
      .toBuffer()
  );
}

/**
 * The API route that generates the OG image
 */
export const GET: APIRoute = async ({ props }) => {
  const markup = createMarkup(props.title, props.description);
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
