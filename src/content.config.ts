import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.string().date(),
    updated: z.string().date().nullable(),
    author: z.string(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/testimonials" }),
  schema: z.object({
    company: z.string().optional(),
    intro: z.string().optional(),
    author: z.object({
      name: z.string(),
      title: z.string(),
      avatar: z.string(),
      url: z.string().url(),
    }),
    order: z.number().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/talks" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    order: z.number().optional(),
  }),
});

export const collections = { articles, testimonials, talks };
