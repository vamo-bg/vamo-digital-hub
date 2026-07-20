import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const contentPattern = '**/*.{md,mdx}';
const shortDescription = z.string().min(1).max(200);
const draft = z.boolean().default(false);
const year = z.union([z.number().int(), z.string().min(1)]).optional();

const resheniya = defineCollection({
  loader: glob({ base: './src/content/resheniya', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: shortDescription,
      order: z.number().int().nonnegative().optional(),
      icon: z.string().optional(),
      image: image().optional(),
      draft,
    }),
});

const portfolio = defineCollection({
  loader: glob({ base: './src/content/portfolio', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      client: z.string().min(1),
      description: shortDescription,
      services: z.array(z.string().min(1)).min(1),
      coverImage: image().optional(),
      year,
      draft,
    }),
});

const eksperti = defineCollection({
  loader: glob({ base: './src/content/eksperti', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      role: z.string().min(1),
      shortBio: z.string().min(1),
      photo: image().optional(),
      order: z.number().int().nonnegative().optional(),
      active: z.boolean().default(true),
      draft,
    }),
});

const sabitiya = defineCollection({
  loader: glob({ base: './src/content/sabitiya', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      location: z.string().min(1).optional(),
      description: z.string().min(1),
      cover: image().optional(),
      draft,
    }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: shortDescription,
      pubDate: z.coerce.date(),
      cover: image().optional(),
      tags: z.array(z.string().min(1)).optional(),
      draft,
    }),
});

const referentsii = defineCollection({
  loader: glob({ base: './src/content/referentsii', pattern: contentPattern }),
  schema: z.object({
    client: z.string().min(1),
    quote: z.string().min(1),
    person: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
    project: z.string().min(1).optional(),
    draft,
  }),
});

const sertifikati = defineCollection({
  loader: glob({ base: './src/content/sertifikati', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      issuer: z.string().min(1),
      year,
      image: image().optional(),
      draft,
    }),
});

export const collections = {
  resheniya,
  portfolio,
  eksperti,
  sabitiya,
  blog,
  referentsii,
  sertifikati,
};
