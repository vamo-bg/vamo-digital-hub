# VAMO Design System

This document is the primary visual reference for the VAMO website. Codex and all other agents must read it before creating or modifying UI. When implementation details conflict with this document, this document takes precedence. Values not defined here must not be presented as approved VAMO design-system values.

## 1. Visual Theme & Atmosphere

VAMO is bold, direct, and highly legible. The identity should feel confident without becoming decorative, loud, or visually aggressive. Every design decision must support communication, hierarchy, and ease of use.

- Use a **60/30/10 distribution** as the compositional guide: approximately 60% primary neutral or cream canvas, 30% supporting neutral surfaces and dark typography, and no more than 10% VAMO Red.
- Treat VAMO Red as a signal, not a background default. Reserve it for primary calls to action, active states, important highlights, and small brand moments.
- Use VAMO Black for authority, structure, and high-contrast typography.
- Use warm neutrals consistently. The interface must feel warm and grounded, never cold, blue-grey, or clinical.
- Use whitespace deliberately to separate ideas, establish rhythm, and make important content feel more prominent.
- Prefer strong typography, clear alignment, and restrained composition over decorative effects.
- Write interface text in **sentence case**. Uppercase is reserved for short eyebrow or overline labels only.
- Keep layouts purposeful and responsive. Mobile is the starting point, not a reduced desktop afterthought.
- Avoid visual clutter. Each section should have a clear primary message and a clear hierarchy.

## 2. Color Palette & Roles

### Brand core

| Token | Value | Role |
| --- | --- | --- |
| **VAMO Red** | `#E3061A` | Primary brand accent, primary calls to action, active states, and critical emphasis. Use sparingly. |
| **VAMO Black** | `#111111` | Primary text, strong headings, dark surfaces, and high-contrast structural elements. |

### Red scale

| Token | Value | Role |
| --- | --- | --- |
| **Red 50** | `#FEF2F2` | Subtle red-tinted backgrounds and low-emphasis status surfaces. |
| **Red 100** | `#FECACA` | Soft red borders, selected backgrounds, and restrained supporting accents. |
| **Red 300** | `#F87171` | Mid-light accent and supporting red state. Do not use for body text without checking contrast. |
| **Red 500** | `#E3061A` | Primary VAMO Red; main CTA and brand-action color. |
| **Red 700** | `#B91C1C` | Strong red interaction state, including hover or pressed treatment where appropriate. |
| **Red 900** | `#7F1D1D` | Deep red for high-emphasis text or dark red surfaces where contrast is verified. |

### Neutral scale

VAMO uses warm greys. Do not substitute cool grey, slate, or blue-grey palettes.

| Token | Value | Role |
| --- | --- | --- |
| **Cream** | `#FAF9F7` | Primary page background and default warm canvas. |
| **Neutral 100** | `#F3F2EE` | Secondary surface, quiet section background, and subtle grouping. |
| **Neutral 200** | `#E5E4DF` | Default border, divider, and stronger surface separation. |
| **Neutral 300** | `#C9C8C2` | Strong border, disabled structure, and low-emphasis controls. |
| **Neutral 400** | `#9A9994` | Muted decorative detail and secondary UI treatment. Use cautiously for text. |
| **Neutral 600** | `#57564F` | Secondary text, descriptions, metadata, and supporting copy. |
| **Neutral 800** | `#2B2A27` | Strong secondary text and dark neutral surfaces. |
| **Black** | `#111111` | Primary text and deepest neutral. |

### Functional colors

Functional colors communicate state and must not be repurposed as decorative accents.

| Token | Value | Role |
| --- | --- | --- |
| **Success** | `#16A34A` | Confirmed success, completion, and positive system feedback. |
| **Warning** | `#D97706` | Caution, attention-required states, and non-destructive warnings. |
| **Info** | `#2563EB` | Informational system feedback and neutral notices. |
| **Error** | `#E3061A` | Errors, destructive warnings, and invalid form states. |

### Color usage rules

- Verify WCAG contrast for every text/background combination and all interactive states.
- Prefer Cream for the page canvas and warm neutrals for section variation.
- Do not use Red 300 or Neutral 400 automatically for text; confirm contrast first.
- Never introduce gradients, glows, or additional accent colors without explicit design-system approval.
- Keep red at or below approximately 10% of the overall composition.

## 3. Typography

### Font families

| Role | Family | CSS token |
| --- | --- | --- |
| **Display and headings** | `"Montserrat"` | `--font-heading` |
| **Body and UI** | `"PT Sans"` | `--font-body`, `--font-ui` |

Use approved webfont files and deliberate font loading. Do not silently replace these families with a different branded typeface. Generic sans-serif may appear only as the technical fallback in the CSS stack.

### Type hierarchy

Use the approved responsive type scale below. Display and heading styles use Montserrat; supporting text styles use PT Sans.

| Style | Desktop | Tablet | Mobile | Weight | Line-height |
| --- | --- | --- | --- | --- | --- |
| **Display** | 72px | 56px | 40px | 700 | 1.0 |
| **H1** | 48px | 40px | 32px | 700 | 1.1 |
| **H2** | 36px | 30px | 26px | 600 | 1.2 |
| **H3** | 24px | 22px | 20px | 600 | 1.3 |
| **H4** | 18px | 18px | 17px | 500 | 1.4 |
| **Eyebrow** | 13px | 13px | 12px | 500 | 1.4 |
| **Overline** | 11px | 11px | 11px | 500 | 1.4 |
| **Body Large** | 18px | 17px | 16px | 400 | 1.6 |
| **Body** | 16px | 16px | 15px | 400 | 1.7 |
| **Body Small** | 14px | 14px | 14px | 400 | 1.6 |
| **Caption** | 12px | 12px | 12px | 400 | 1.5 |

### Typography rules

- Use Montserrat for headings and display text; use PT Sans for paragraphs, navigation, labels, buttons, and forms.
- Use `-0.02em` letter-spacing for Montserrat headings; Display uses `-0.03em`.
- Eyebrow labels are always VAMO Red (`#E3061A`), uppercase, and use `0.12em` letter-spacing.
- Overline labels are always Neutral 400 (`#9A9994`), uppercase, and use `0.15em` letter-spacing.
- Never use a font weight below 400 or above 700.
- Use sentence case for headings, navigation, buttons, and labels.
- Uppercase is allowed only for short eyebrows or overlines. Never set sentences or long labels in uppercase.
- Keep body text comfortably readable with relaxed line-height. Do not use compressed leading.
- Keep long-form text to a readable line length; avoid paragraphs spanning the full viewport width.
- Heading letter-spacing should be controlled and intentional. Do not add loose tracking to display text.
- Establish hierarchy through family, size, weight, whitespace, and color—not through unnecessary decoration.
- Do not use Title Case for interface copy.

## 4. Spacing & Layout

Spacing creates VAMO’s hierarchy and rhythm. Use fewer, stronger spatial relationships rather than many arbitrary gaps.

### Spacing scale

The exact spacing values remain pending approval. Until they are confirmed:

- Use the named CSS tokens in `src/styles/tokens.css`; do not hardcode one-off spacing values in components.
- Follow the ordered scale: `--space-0`, `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8`, `--space-10`, `--space-12`, `--space-16`, `--space-20`, `--space-24`, and `--space-32`.
- Treat the current numeric token values as provisional implementation scaffolding, not final design-system values.
- Prefer larger gaps between conceptual groups and smaller gaps between closely related elements.
- Use consistent page gutters and content containment across sections.
- Reduce spacing proportionally on smaller screens while preserving clear separation and touch usability.

### Layout principles

- Design mobile-first and progressively enhance at tablet and desktop widths.
- Use a consistent content container and alignment grid across the page.
- Prefer CSS Grid for page-level composition and complex alignment.
- Collapse multi-column layouts into a clear single-column reading order on mobile.
- Prevent horizontal overflow at every viewport.
- Keep content in the normal document flow; avoid fragile overlap and absolute positioning for primary content.
- Let whitespace establish hierarchy. Do not fill empty space merely to make a section feel busy.
- Preserve a minimum interactive target of `44px` where controls are used on touch devices. This is an accessibility requirement, not a VAMO brand token.

## 5. Border Radius

The exact VAMO radius values are not yet approved. Use the provisional semantic levels already prepared in `src/styles/tokens.css`:

- `--radius-none` — square edges where structure calls for them.
- `--radius-sm` — compact controls and subtle rounding.
- `--radius-md` — standard controls and small surfaces.
- `--radius-lg` — larger components and grouped surfaces.
- `--radius-xl` — prominent containers, used sparingly.
- `--radius-full` — pills, circular controls, and avatars only.

Use one radius level consistently within a component family. Do not mix arbitrary corner values, and do not default every container to a rounded card.

## 6. Components (high-level guidance)

### Buttons

- Use VAMO Red for the primary action and limit each visual region to one clearly dominant primary action.
- Use VAMO Black or a restrained outline/text treatment for secondary actions.
- Use sentence-case labels with clear, specific verbs.
- Provide visible hover, focus, active, and disabled states.
- Focus states must be clearly visible and must not rely on color alone.
- Avoid gradients, glow effects, ornamental icons, and exaggerated pill shapes unless the component specification later requires them.

### Cards

- Use cards only when a boundary, grouping, or interactive unit is genuinely needed.
- Prefer whitespace, alignment, or a warm-neutral divider when elevation does not communicate useful hierarchy.
- Use Cream and warm neutral surfaces; do not introduce cool-grey card fills.
- Keep card hierarchy typographic and content-led. Avoid decorative badges, excessive shadows, and nested cards.
- Make the entire card interactive only when it represents one clear destination, and preserve an accessible focus state.

### Forms

- Place persistent labels above fields. Do not use placeholders as labels.
- Put helper text near the related input and error text immediately below it.
- Use VAMO Red for error communication, paired with clear written guidance.
- Use Success, Warning, and Info only for their defined system meanings.
- Maintain generous touch targets, visible focus states, and predictable keyboard order.
- Keep required/optional wording explicit and concise.

## 7. Do’s and Don’ts

### Do

- Do use VAMO Red strategically for high-value actions and emphasis.
- Do keep red to approximately 10% or less of the composition.
- Do use Cream and the specified warm neutral scale throughout the interface.
- Do use Montserrat for headings and PT Sans for body and UI text.
- Do write headings, buttons, navigation, and labels in sentence case.
- Do reserve uppercase for short eyebrow or overline labels.
- Do use whitespace to create rhythm, focus, and hierarchy.
- Do maintain strong contrast, visible keyboard focus, and accessible touch targets.
- Do create one clear primary message and action per section.
- Do reference tokens instead of repeating raw values inside components.

### Don’t

- Don’t let VAMO Red dominate backgrounds or large areas; it is an accent, not the default canvas.
- Don’t exceed the approximate 10% red allocation without explicit art direction.
- Don’t use Title Case for headings, navigation, buttons, or labels.
- Don’t use uppercase for sentences, paragraphs, or long controls.
- Don’t introduce cool greys, slate tones, blue-grey neutrals, or unapproved accent colors.
- Don’t replace VAMO Black with pure black (`#000000`).
- Don’t introduce gradients, neon glows, glass effects, or decorative shadows.
- Don’t add arbitrary typography, spacing, radius, or breakpoint values and describe them as approved.
- Don’t use decoration to compensate for weak hierarchy or unclear content.
- Don’t create card-heavy layouts when alignment, spacing, or dividers communicate the structure more clearly.
- Don’t hide labels, focus indicators, validation messages, or essential content for visual minimalism.

---

**Implementation source:** CSS custom properties live in `src/styles/tokens.css`. Update this document and the token file together whenever an approved design-system value changes.
