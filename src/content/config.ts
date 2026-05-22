import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { posts };
