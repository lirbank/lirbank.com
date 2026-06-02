import type { APIRoute } from "astro";
import metadata from "../../../metadata.json";
import { createHomepageMarkup } from "../../lib/og";
import { logoPromise, renderToPng } from "../../lib/og-render";

export const GET: APIRoute = async () => {
  const logo = await logoPromise;
  const markup = createHomepageMarkup(
    "Ship AI systems with confidence",
    metadata.description,
    metadata.name,
    logo,
  );
  const png = await renderToPng(markup);

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
