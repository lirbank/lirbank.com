import type { APIRoute } from "astro";
import { frontmatter } from "../brand.md";
import { createSimplePageMarkup } from "../../lib/og";
import { logoPromise, renderToPng } from "../../lib/og-render";

export const GET: APIRoute = async () => {
  const logo = await logoPromise;
  const markup = createSimplePageMarkup(
    frontmatter.title,
    frontmatter.description,
    logo,
  );
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
