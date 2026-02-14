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
import satori from "satori";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { createMarkup, WIDTH, HEIGHT } from "../../lib/og";

// Satori doesn't support woff2, so we can't use the same gstatic URL the
// website loads (see src/styles/fonts.css). Fontsource serves woff which works.
const FONT_URL = "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin";

/**
 * All Inter weights (100–900). Fetched in parallel at build time, no runtime cost.
 */
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

async function loadFonts() {
  const buffers = await Promise.all(
    WEIGHTS.map((w) =>
      fetch(`${FONT_URL}-${w}-normal.woff`).then((r) => r.arrayBuffer()),
    ),
  );
  return WEIGHTS.map((weight, i) => ({
    name: "Inter",
    data: buffers[i],
    weight,
    style: "normal" as const,
  }));
}

// Fetched once at build time, shared across all routes
const fontsPromise = loadFonts();

/**
 * Pre-rasterize the SVG logo to a high-res PNG buffer so Satori can embed it
 * as a crisp image (Satori's inline SVG support is limited and produces blur).
 */
const logoPromise = sharp(
  readFileSync(new URL("../../../public/brand/icon.svg", import.meta.url)),
)
  .resize(128, 128)
  .png()
  .toBuffer()
  .then((buf) => new Uint8Array(buf).buffer as ArrayBuffer);

/**
 * Enumerate all articles to generate the static paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection("articles");
  return articles.map((article) => ({
    params: { slug: article.id.replace(/\.md$/, "") },
    props: {
      title: article.data.title ?? article.id,
      description: article.data.description ?? "",
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
  const logo = await logoPromise;
  const markup = createMarkup(props.title, props.description, logo);
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
