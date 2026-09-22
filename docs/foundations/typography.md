# Typography

Implements `docs/decisions/0004-typography.md` (amended): **Geist** for all
UI and all of B2B, **Bricolage Grotesque** for B2C headlines, event names
and the wordmark. Both variable, self-hosted, OFL. Values live in
`src/tokens/typography.ts` and `src/styles/fonts.css`.

Experimental as of 2026-09-22. The pairing has not yet been tested on an
event card and a data table, which 0004 requires before it settles.

## Families

| Token | Stack | Tailwind | Use |
|---|---|---|---|
| sans | Geist, system-ui | `font-sans` | Everything by default |
| display | Bricolage Grotesque, Geist | `font-display` | B2C headlines, event names, wordmark |
| mono | Geist Mono, ui-monospace | `font-mono` | Codes, IDs, aligned data |

Files under `src/styles/fonts/`: one variable woff2 per family and style.
Bricolage carries optical size, width and weight axes in one 200KB file;
subset it before the first Usher release if it shows on the network tab.

Weights: regular 400, medium 500, semibold 600, bold 700 (`font-medium`).
Tracking: tight -0.02em (display sizes only), normal, wide 0.04em
(`tracking-wide`, for overlines).

## One scale, two registers

Step names are shared; values change with the nearest `data-register`.
B2C is roomy and mobile first. B2B is dense and desktop first. The same
`text-base` class renders both.

| Step | B2C size / line | B2B size / line |
|---|---|---|
| xs | 12 / 16 | 12 / 16 |
| sm | 14 / 20 | 13 / 18 |
| base | 16 / 24 | 14 / 20 |
| lg | 18 / 28 | 16 / 22 |
| xl | 20 / 28 | 18 / 24 |
| 2xl | 24 / 32 | 20 / 26 |
| 3xl | 30 / 36 | 24 / 30 |
| 4xl | 36 / 40 | 30 / 34 |
| 5xl | 48 / 52 | 36 / 40 |

Nothing goes below 12px in either register. Tests enforce this, the
ascending order, and that B2B is never larger than B2C at a step.

## Text styles

Named styles are emitted as `type-*` utilities so a component sets one
class. The `Text` component will map its `variant` prop onto these.

| Utility | Family | Step | Weight | Notes |
|---|---|---|---|---|
| `type-display-xl` | display on B2C, sans on B2B | 5xl | bold | tight |
| `type-display-lg` | display on B2C, sans on B2B | 4xl | bold | tight |
| `type-title` | display on B2C, sans on B2B | 3xl | semibold | tight; event names |
| `type-heading` | sans | 2xl | semibold | tight |
| `type-subheading` | sans | lg | semibold | |
| `type-body` | sans | base | regular | |
| `type-body-sm` | sans | sm | regular | |
| `type-label` | sans | sm | medium | form labels, buttons |
| `type-caption` | sans | xs | regular | |
| `type-overline` | sans | xs | semibold | wide tracking, uppercase by the component |
| `type-numeric` | sans | base | medium | tabular lining figures: prices, counts, cells |
| `type-code` | mono | sm | regular | |

The display face never appears on B2B: the three display styles resolve to
Geist inside `data-register="b2b"`. Producers get calm; attendees get voice.

## Rules

- Tables and prices use `type-numeric` or `tabular-nums`. Never proportional
  figures in a column.
- Display styles are for one line, at most two. Body copy is never set in
  the display face.
- Do not set a size outside the scale. If a step is missing, add it to the
  tokens for both registers.
