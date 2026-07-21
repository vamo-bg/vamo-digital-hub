# VAMO Digital Hub

VAMO Digital Hub is an AI-ready platform for organizing and presenting VAMO's media work, cultural projects, audiovisual archive, professional services, and regional stories. Built as a Bulgarian-first digital foundation, it brings these connected areas into a clear, maintainable system that can grow with VAMO's editorial and business needs.

- **Live project:** [vamo-digital-hub.vercel.app](https://vamo-digital-hub.vercel.app/)
- **Public repository:** [github.com/vamo-bg/vamo-digital-hub](https://github.com/vamo-bg/vamo-digital-hub)

## Current project status

VAMO Digital Hub is an evolving OpenAI Build Week prototype. The project foundation, design system, reusable interface components, responsive layout patterns, and structured content architecture are already implemented. The current version establishes a production-oriented base for continued design, content, archive, and platform development.

## Requirements

- Node.js 22 LTS or newer (see `.nvmrc`)
- npm 10 or newer

## Getting started

```sh
nvm use
npm install
cp .env.example .env
npm run dev
```

The local development server is available at `http://localhost:4321` by default.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run check` | Run Astro and TypeScript diagnostics |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Architecture

```text
src/
├── assets/                 # Images imported into Astro's asset pipeline
├── components/
│   ├── layout/             # Header, footer, navigation, containers
│   ├── sections/           # Composable page-level sections
│   └── ui/                 # Small reusable UI primitives
├── content/
│   ├── articles/           # Article Markdown and MDX entries
│   └── pages/              # Structured long-form page content
├── content.config.ts       # Typed collection definitions
├── layouts/                # Shared document/page shells
├── pages/                  # File-based routes
└── styles/
    ├── global.css          # Tailwind import and global baseline
    └── tokens.css          # Brand and semantic design tokens
```

Files served unchanged (favicons, robots files, and similar assets) belong in `public/`.

## Technical decisions

- **Astro with strict TypeScript:** static output by default for speed, resilience, and straightforward deployment.
- **Tailwind CSS via its Vite plugin:** current Tailwind integration with no unnecessary client runtime. Brand values must originate in `tokens.css` once approved.
- **MDX and content collections:** flexible editorial content with schemas validated during development and builds.
- **Sitemap:** automatically generated from canonical routes; `site` is set in `astro.config.mjs` and must match the final production domain.
- **Sharp:** deterministic, optimized image processing through Astro's asset pipeline.

## Content conventions

- UI copy and public content are Bulgarian-first.
- Every page must supply a unique title and meta description to `BaseLayout`.
- Place optimizable images in `src/assets/`; reserve `public/` for files that must keep their original filename.
- Do not introduce brand colours, fonts, spacing, or other visual values before mapping the approved VAMO Design System into `src/styles/tokens.css`.

## How Codex and GPT-5.6 were used

Codex and GPT-5.6 supported the project through an iterative, human-directed development workflow. Their contributions included:

- Translating the founder's business and media vision into a practical technical architecture.
- Setting up the Astro and strict TypeScript foundation.
- Creating and implementing the VAMO design system and semantic design tokens.
- Developing reusable UI components and responsive layouts.
- Defining Astro Content Collections and Zod schemas for structured content.
- Organizing Bulgarian-language content for consistent editorial use.
- Improving accessibility, code clarity, and long-term maintainability.
- Running Astro diagnostics and production builds throughout development.
- Iterating on the implementation through structured feedback and review.

The current prototype is AI-ready, but it does not claim an existing OpenAI API integration.

## What's next

Planned development includes:

- Expanding and refining the Solutions and Portfolio pages.
- Integrating VAMO's audiovisual archive into the structured content system.
- Introducing multilingual content while preserving Bulgarian as the primary language.
- Developing smarter search across services, projects, stories, and archive materials.
- Exploring future AI-assisted content workflows for classification, discovery, editorial support, and archive management.

## Before launch

- Confirm the production URL in `astro.config.mjs`.
- Replace the placeholder favicon and add approved social images.
- Add approved local font files and their preload declarations.
- Add `robots.txt`, analytics, privacy, and consent configuration after requirements are confirmed.
