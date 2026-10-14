import type { APIRoute } from "astro";
import { homepage } from "../../data/homepage";
import { createHomepageMarkup } from "../../lib/og";
import { renderToPng } from "../../lib/og-render";

export const GET: APIRoute = async () => {
  const markup = createHomepageMarkup(
    homepage.headline,
    homepage.description,
    homepage.title,
  );
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
