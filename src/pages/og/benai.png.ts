import type { APIRoute } from "astro";
import { frontmatter } from "../benai.md";
import { createSimplePageMarkup } from "../../lib/og";
import { renderToPng } from "../../lib/og-render";

export const GET: APIRoute = async () => {
  const markup = createSimplePageMarkup(
    frontmatter.title,
    frontmatter.description,
  );
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
