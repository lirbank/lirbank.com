// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.lirbank.com",
  integrations: [sitemap({ filter: (page) => !page.includes("/brand") })],
  markdown: {
    // Plain mono on wash, per the design — no syntax colors
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
  },
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
