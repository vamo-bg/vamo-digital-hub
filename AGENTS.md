# VAMO Agent Guide

## 1. Project overview

VAMO is a Bulgarian, content-rich company website built with the latest stable Astro and strict TypeScript. The goal is a fast, modern, maintainable, accessible, and SEO-friendly experience that follows the VAMO Design System precisely.

- **Stack:** Astro, TypeScript, Tailwind CSS, MDX, Astro content collections
- **Primary website language:** Bulgarian (`bg`)
- **Output:** Static-first, performance-focused pages with minimal client-side JavaScript

## 2. Sources of truth

Before creating or modifying UI, always read:

1. `DESIGN.md` — the primary visual and design reference
2. `src/styles/tokens.css` — the implementation source for CSS custom properties

Use documented tokens instead of repeating raw values in components. Do not invent colors, typography, spacing, radii, or other design values. If a required value is undefined, mark it clearly as pending or ask for direction.

## 3. Non-negotiable rules

- Follow the **60/30/10** color-distribution principle.
- Keep VAMO Red to approximately 10% or less of each composition. Reserve it for primary actions, active states, and intentional emphasis.
- Use sentence case for headings, navigation, buttons, labels, and interface copy. Only short eyebrows and overlines use uppercase.
- Use the approved warm-neutral palette. Never introduce cool greys, slate, or blue-grey neutrals.
- Design mobile-first, then progressively enhance for tablet and desktop.
- Accessibility is required: maintain sufficient contrast, visible keyboard focus, semantic HTML, logical reading order, and touch targets of at least 44px.
- Keep public-facing content and UI copy in Bulgarian unless a multilingual requirement is explicitly introduced.

## 4. Project structure

```text
src/
├── assets/                 # Images processed by Astro's asset pipeline
├── components/
│   ├── ui/                 # Reusable primitives: buttons, inputs, icons, cards
│   ├── layout/             # Header, footer, navigation, containers
│   └── sections/           # Composable page-level sections
├── content/                # Markdown and MDX content entries
├── content.config.ts       # Typed content-collection schemas
├── layouts/                # Shared document and page shells
├── pages/                  # Astro file-based routes
└── styles/
    ├── tokens.css          # Design-system custom properties
    └── global.css          # Global baseline and shared styles
```

Place files that need Astro image optimization in `src/assets/`. Use `public/` only for assets that must be served unchanged at a stable URL.

## 5. Working style

- Prefer small, focused, production-ready changes.
- Preserve existing behavior and avoid unrelated edits.
- Keep components composable, code modern, and dependencies minimal.
- Use TypeScript for component props, data models, utilities, and content schemas where it improves safety and clarity.
- Prefer semantic HTML and CSS-driven behavior; add client-side JavaScript only when the interaction requires it.
- Briefly explain important technical or design decisions when handing off work.
- Run `npm run check` and an appropriate build or test before declaring implementation work complete.

## 6. Current status

- Astro project scaffolding is complete.
- Design-system documentation and tokens are ready in `DESIGN.md` and `src/styles/tokens.css`.
- The next focus is layout foundations, global styles, and core reusable components.
