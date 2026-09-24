import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const contentPattern = '**/*.{md,mdx}';
const shortDescription = z.string().min(1).max(200);
const draft = z.boolean().default(false);
const year = z.union([z.number().int(), z.string().min(1)]).optional();

const clients = defineCollection({
  loader: glob({ base: './src/content/clients', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      description: shortDescription,
      logo: image().optional(),
      website: z.url().optional(),
      featuredInSection: z.boolean().default(false),
      sectionOrder: z.number().int().nonnegative().optional(),
      order: z.number().int().nonnegative().optional(),
      // За <title>/<meta description> — `name`/`description` остават късия
      // етикет за картите в мрежата. Виж `eksperti` за същия модел.
      seoTitle: z.string().min(1).optional(),
      seoDescription: shortDescription.optional(),
      draft,
    }),
});

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: contentPattern }),
  schema: z.object({
    title: z.string().min(1),
    description: shortDescription,
    // `title` захранва и breadcrumb-а (къс label) — SEO <title> има нужда от
    // отделно, по-богато поле. Виж `eksperti` за същия модел.
    seoTitle: z.string().min(1).optional(),
    seoDescription: shortDescription.optional(),
    heroTitle: z.string().min(1),
    heroSummary: z.string().min(1),
    story: z.object({
      title: z.string().min(1),
      lead: z.string().min(1),
      details: z.array(z.string().min(1)).max(2).default([]),
    }),
    principles: z.object({
      title: z.string().min(1),
      intro: z.string().min(1),
      items: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })).min(1).max(5),
    }),
    audiences: z.object({
      title: z.string().min(1),
      intro: z.string().min(1),
      items: z.array(z.string().min(1)).min(1).max(5),
    }),
    draft,
  }),
});

const process = defineCollection({
  loader: glob({ base: './src/content/process', pattern: contentPattern }),
  schema: z.object({
    title: z.string().min(1),
    description: shortDescription,
    // `title` захранва и breadcrumb-а (къс label) — SEO <title> има нужда от
    // отделно, по-богато поле. Виж `eksperti` за същия модел.
    seoTitle: z.string().min(1).optional(),
    seoDescription: shortDescription.optional(),
    heroTitle: z.string().min(1),
    heroSummary: z.string().min(1),
    steps: z
      .array(
        z.object({
          title: z.string().min(1),
          summary: z.string().min(1),
          detail: z.string().min(1),
        }),
      )
      .min(3)
      .max(6),
    collaboration: z.object({
      title: z.string().min(1),
      lead: z.string().min(1),
      items: z
        .array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1),
          }),
        )
        .min(2)
        .max(4),
    }),
    draft,
  }),
});

const resheniya = defineCollection({
  loader: glob({ base: './src/content/resheniya', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: shortDescription,
      order: z.number().int().nonnegative().optional(),
      icon: z.string().optional(),
      image: image().optional(),
      heroStatement: z.string().min(1).optional(),
      heroDetails: z.string().min(1).optional(),
      problems: z
        .object({
          title: z.string().min(1),
          intro: z.string().min(1),
          items: z.array(
            z.object({
              title: z.string().min(1),
              description: z.string().min(1),
            }),
          ).min(1),
        })
        .optional(),
      difference: z
        .object({
          title: z.string().min(1),
          intro: z.string().min(1),
          items: z.array(
            z.object({
              title: z.string().min(1),
              description: z.string().min(1),
            }),
          ).min(1),
        })
        .optional(),
      process: z
        .object({
          title: z.string().min(1),
          intro: z.string().min(1),
          steps: z.array(
            z.object({
              title: z.string().min(1),
              description: z.string().min(1),
            }),
          ).min(1),
        })
        .optional(),
      inclusions: z
        .object({
          title: z.string().min(1),
          intro: z.string().min(1),
          items: z.array(
            z.object({
              title: z.string().min(1),
              description: z.string().min(1),
            }),
          ).min(1),
        })
        .optional(),
      featuredInSection: z.boolean().default(false),
      sectionOrder: z.number().int().nonnegative().optional(),
      // За <title>/<meta description> — `title`/`description` остават късия
      // етикет за картите в мрежата. Виж `eksperti` за същия модел.
      seoTitle: z.string().min(1).optional(),
      seoDescription: shortDescription.optional(),
      draft,
    }),
});

const portfolio = defineCollection({
  loader: glob({ base: './src/content/portfolio', pattern: contentPattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      clientId: z.string().min(1),
      description: shortDescription,
      serviceIds: z.array(z.string().min(1)).min(1),
      projectType: z.string().min(1).optional(),
      year,
      location: z.string().min(1).optional(),
      featuredInSection: z.boolean().default(false),
      sectionOrder: z.number().int().nonnegative().optional(),
      sectionVariant: z.enum(['featured', 'standard']).default('standard'),
      /**
       * Register of the opening chapter below the hero. Omit it and the page
       * derives one from the available material (see `resolveLead` in
       * `src/pages/portfolio/[slug].astro`).
       */
      lead: z.enum(['film', 'exhibition', 'platform', 'editorial']).optional(),
      leadImage: image().optional(),
      leadImageAlt: z.string().min(1).optional(),
      overview: z
        .object({
          lead: z.string().min(1),
          details: z.string().min(1).optional(),
        })
        .optional(),
      task: z
        .object({
          summary: z.string().min(1),
          goals: z.array(z.string().min(1)).default([]),
        })
        .optional(),
      deliverables: z
        .array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1),
          }),
        )
        .default([]),
      outcome: z.string().min(1).optional(),
      resultSummary: z.string().min(1).max(280).optional(),
      results: z
        .array(
          z.object({
            value: z.string().min(1),
            label: z.string().min(1),
            detail: z.string().min(1).optional(),
          }),
        )
        .default([]),
      expertIds: z.array(z.string().min(1)).default([]),
      coverImage: image().optional(),
      coverAlt: z.string().min(1).optional(),
      gallery: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(1),
            caption: z.string().min(1).optional(),
          }),
        )
        .default([]),
      externalLinks: z
        .array(
          z.object({
            label: z.string().min(1),
            url: z.url(),
          }),
        )
        .default([]),
      referenceDocuments: z
        .array(
          z.object({
            title: z.string().min(1),
            previewImage: image(),
            previewAlt: z.string().min(1),
            transcript: z.string().min(1),
            excerpt: z.string().min(1).max(300).optional(),
            author: z.string().min(1).optional(),
            authorPosition: z.string().min(1).optional(),
            organization: z.string().min(1).optional(),
            pdfHref: z.string().min(1).optional(),
            featuredInSection: z.boolean().default(false),
            sectionOrder: z.number().int().nonnegative().optional(),
          }),
        )
        .default([]),
      review: z
        .object({
          quote: z.string().min(1),
          person: z.string().min(1),
          position: z.string().min(1).optional(),
          image: image().optional(),
        })
        .optional(),
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
      photoAlt: z.string().min(1).optional(),
      expertise: z.array(z.string().min(1)).default([]),
      heroHighlights: z.array(z.string().min(1)).max(3).optional(),
      services: z.array(reference('resheniya')).default([]),
      featuredOnHome: z.boolean().default(false),
      homeOrder: z.number().int().nonnegative().optional(),
      order: z.number().int().nonnegative().optional(),
      active: z.boolean().default(true),
      seoTitle: z.string().min(1).optional(),
      seoDescription: shortDescription.optional(),
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
      updatedDate: z.coerce.date().optional(),
      authorName: z.string().min(1).default('Екипът на VAMO'),
      authorId: z.string().min(1).optional(),
      cover: image().optional(),
      coverAlt: z.string().min(1).optional(),
      readingTime: z.string().min(1).optional(),
      highlight: z
        .object({
          value: z.string().min(1).max(24),
          label: z.string().min(1),
          description: z.string().min(1).optional(),
        })
        .optional(),
      relatedSolutions: z.array(reference('resheniya')).max(3).default([]),
      featuredInSection: z.boolean().default(false),
      sectionOrder: z.number().int().nonnegative().optional(),
      sectionVariant: z.enum(['lead', 'standard']).default('standard'),
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

const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: contentPattern }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const collections = {
  clients,
  about,
  process,
  resheniya,
  portfolio,
  eksperti,
  blog,
  sertifikati,
  legal,
};
