// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.lirbank.com",
  integrations: [
    icon(),
    sitemap({ filter: (page) => !page.includes("/brand") }),
  ],
  markdown: {
    smartypants: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
  },
});
