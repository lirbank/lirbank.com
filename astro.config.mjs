// @ts-check
import { defineConfig, fontProviders } from "astro/config";
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
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.google(),
      weights: ["100 900"],
      styles: ["normal", "italic"],
      subsets: ["latin", "greek"],
      // Request Inter's optical-sizing axis (in addition to the default wght axis)
      // so the file matches the variable build production was using.
      options: {
        experimental: {
          variableAxis: {
            opsz: [["14", "32"]],
          },
        },
      },
    },
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
  trailingSlash: "never",
});
