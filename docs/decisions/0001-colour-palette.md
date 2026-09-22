# 0001. Colour palette

- **Status:** accepted (temporary, revisit before first Usher release)
- **Date:** 2026-09-22
- **Deciders:** owner (accepted recommendation as temporary)

## Context

Colour is the fastest way a person recognises Evento Livre. It has to work in
two registers: dense producer dashboards on desktop (B2B) and attendee screens
on phones, often outdoors in sunlight or in a dark venue (B2C). Usher is the
first consumer.

Constraints that apply to every option:

- WCAG 2.2 AA contrast for text and UI on both light and dark surfaces.
- A dark theme is not optional. Event goers use the product at night.
- Event imagery (posters, photos) will sit next to brand colour constantly. The
  palette must not fight with arbitrary artwork.
- Semantic colours (success, warning, danger, info) must be distinguishable
  from the brand colour and from each other, including for colour-blind users.
- Market context in Brazil: Sympla (purple/blue), Ingresse (blue), Eventim
  (yellow/black), Eventbrite (orange). Avoid landing on top of one of them.

Hex values below are illustrative, to make the options concrete. They are not
the decision.

## Options considered

### Option A. One brand hue, neutral-led

A single saturated brand hue (11 steps, 50 to 950) plus a warm-tinted neutral
scale and four semantic scales. Brand colour is used sparingly: primary
actions, focus rings, the logotype. Everything else is neutral.

Candidate hues: electric green (`#22C55E` family, "livre" = free, go, open),
or vivid coral (`#FF5A5F` family, energy without being Eventbrite orange).

- Pros: simplest to implement and document. Easy AA compliance. Neutral
  surfaces let event artwork be the hero. Scales cleanly to dark mode.
- Cons: one hue carries the whole personality. Risk of looking generic if the
  hue is safe. Green collides with "success" unless success is re-mapped.

### Option B. Two hues, one per register

A shared neutral scale, one **brand** hue that appears everywhere, and one
**accent** hue that changes by audience. B2B defaults to a cool, calm accent
(for data, charts, secondary actions). B2C defaults to a warm, high-energy
accent (for highlights, badges, moments of delight).

Candidate pairing: brand deep violet (`#6D28D9` family) with B2B accent teal
(`#0D9488`) and B2C accent hot pink (`#EC4899`).

- Pros: expresses "one brand, two registers" directly in colour. Producers get
  calm, attendees get energy, both still read as Evento Livre.
- Cons: more tokens, more testing, more ways to misuse. Violet is close to
  Sympla's territory. Needs discipline so the accent never replaces the brand.

### Option C. Stage palette: near-monochrome plus one flash

Near-black and off-white as the foundation, like a stage before the lights come
on. One high-chroma "flash" colour used at small scale only: buttons, active
states, the mark. Event artwork provides all other colour.

Candidate flash: acid yellow (`#EAB308` family) or signal orange-red
(`#F97316` family). Yellow risks Eventim; orange risks Eventbrite. Chartreuse
(`#A3E635` family) avoids both.

- Pros: strongest editorial identity. Photos and posters pop. Dark mode is
  the natural state, light mode is the inversion. Cheap to maintain.
- Cons: harsh for long B2B sessions unless the neutrals are softened. A single
  flash colour on near-black is hard to make AA at text sizes, so it must stay
  on shapes, not text. Less room for semantic colours to stand out.

## Recommendation

Option B, with a hue that is not violet. It is the only option that encodes the
two-audience mission in the palette itself, and the extra token cost is small
compared to forking components later. Suggested brand hue exploration:
deep teal-blue or forest green, both open in the Brazilian ticketing market.

## Decision

Option B, two hues, one per register, **accepted as temporary** on
2026-09-22. Brand hue must not be violet; explore deep teal-blue or forest
green first. B2B accent cool, B2C accent warm. Neutral scale shared.

This is provisional. It may be replaced without a superseding record until
the first Usher screens ship. Build tokens as `brand-*`, `accent-b2b-*`,
`accent-b2c-*` so the actual hues can be swapped without touching components.

**Amended 2026-09-22:** brand hue is **deep teal-blue**. Forest green is
withdrawn. B2B accent stays cool (pick a hue clearly separated from the brand,
not a lighter teal), B2C accent stays warm. Success must be visibly distinct
from the brand hue at every step where the two can meet. Record the chosen
hex scales and the contrast tables in `docs/foundations/colour.md`; the hue
choice itself is fixed by this amendment and may still be replaced without a
superseding record until the first Usher screens ship.

## Consequences

Now unblocked: create `src/tokens/colors.ts`, wire into
`tailwind.config.ts`, write `docs/foundations/colour.md` with contrast tables,
and re-map semantic colours if they collide with the brand hue.
