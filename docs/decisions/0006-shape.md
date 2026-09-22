# 0006. Shape: spacing, radii, elevation

- **Status:** accepted (temporary, revisit before first Usher release)
- **Date:** 2026-09-22
- **Deciders:** owner (accepted recommendation as temporary)

## Context

Spacing, corner radius and elevation are listed as foundations in
`MISSION.md` but had no guidance. They carry personality: tight corners and
hard shadows read as corporate tooling, generous corners and soft shadows
read as friendly and consumer. The semiotics doc asks every visible sign to
be warm and hand-drawn, and the same "corner logic" is meant to run through
the mark, the icons and the UI. Both registers share components, so the shape
scale must work on a dense producer table and on an attendee's ticket.

## Options considered

1. **Tight and flat.** 4px base, radii 2 to 6px, elevation mostly by
   borders. Pros: dense, calm for B2B. Cons: cold; fights the warmth the
   semiotics doc requires.
2. **Soft and rounded.** 4px base, generous radii (controls around 12px,
   cards 16 to 20px, chips and avatars full pill), soft low-opacity layered
   shadows in light mode, surface lightening plus a hairline border in dark
   mode. Pros: warm, matches the hand-drawn mark, friendly for B2C. Cons:
   B2B density must come from spacing, not from sharper corners.
3. **Two shape sets, one per register.** Pros: each audience gets its ideal.
   Cons: forks the components, which `CLAUDE.md` forbids.

## Decision

Option 2, **soft and rounded**, accepted as temporary on 2026-09-22.

- **Spacing:** 4px base unit, a single shared scale. B2B density is a
  spacing default (a `data-register="b2b"` context that selects tighter
  paddings), never a different scale.
- **Radii:** one scale from `xs` to `full`. Controls (buttons, inputs) use
  the `md` step, containers (cards, sheets, dialogs) use `lg` or `xl`, and
  badges, chips and avatars use `full`. The mark and icons use the same
  corner logic at their own scale.
- **Elevation:** a small set of levels (`0` flat, `1` raised, `2` overlay,
  `3` modal). Light theme uses soft multi-layer shadows with low opacity.
  Dark theme uses a lighter surface tint per level plus a hairline border;
  shadows are near-invisible on dark surfaces and are not relied on.

Exact pixel values and shadow definitions live in `src/tokens/` and are
documented in `docs/foundations/`. They may change without a superseding
record until the first Usher screens ship. Switching away from "soft and
rounded" as the personality requires a new record.

## Consequences

Unblocks `src/tokens/spacing.ts`, `src/tokens/radii.ts`,
`src/tokens/elevation.ts` and `docs/foundations/shape.md`. Iconography and
the mark must follow the same corner logic (see `docs/brand/semiotics.md`).
