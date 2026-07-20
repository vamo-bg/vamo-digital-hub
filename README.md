# VAMO website

Production-oriented Astro foundation for the new Bulgarian-language VAMO website.

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

## Before launch

- Confirm the production URL in `astro.config.mjs`.
- Replace the placeholder favicon and add approved social images.
- Add approved local font files and their preload declarations.
- Add `robots.txt`, analytics, privacy, and consent configuration after requirements are confirmed.
