import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
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

export const collections = { blog, testimonials, talks };
