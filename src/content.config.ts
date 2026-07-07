import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.iso.date(),
    updated: z.iso.date().nullable(),
    author: z.string(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    author: z.object({
      name: z.string(),
      title: z.string(),
      avatar: z.string(),
      url: z.url(),
    }),
    order: z.number().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { articles, testimonials };
