# Mission

## Why this exists

Evento Livre wants to capture the event economy: the money, time and attention
that flow around events, from the producer planning them to the person attending.
A single visual and interaction language across every product is how the company
becomes recognisable on both sides of that market.

This repository is that language, expressed as code.

## Who we serve

Evento Livre sells to two audiences at once:

- **B2B: event producers.** Organisers, promoters, venue teams. They live in
  dashboards, forms, tables and reports. They need density, clarity and trust.
- **B2C: event goers.** People discovering, buying and attending. They live on
  their phones, often in a hurry, often outdoors. They need speed, delight and
  zero friction.

One brand, two audiences. The system must feel like the same company on a
producer's admin screen and on an attendee's ticket, without forcing one
audience's needs onto the other.

## Products today

- **Usher** is the only product right now. It is the first consumer of this
  design system and the primary source of real requirements. Every decision
  should be tested against "would this work in Usher?".

Future products will share this system. Do not design for them yet, but do not
paint the system into a corner named "Usher" either.

## What the design system delivers

1. **Foundations.** Colour palette, typography, spacing, radii, elevation,
   motion. Expressed as design tokens that Tailwind consumes.
2. **Brand assets.** Logotype, marks, clear-space rules, usage guidance.
   Every non-verbal sign follows `docs/brand/semiotics.md`: it points at
   the moment an attendee shows their phone and is let in.
3. **Components.** Accessible React + TypeScript components styled with
   Tailwind, from primitives (Button, Input) to patterns (Form, DataTable,
   EventCard).
4. **Documentation.** Enough that a product engineer can use a component
   without asking, and a designer can extend one without breaking it.

## Brand decisions

The four brand-defining decisions are accepted as temporary (2026-09-22) and
recorded in `docs/decisions/`. They unblock work but are expected to be
revisited before the first Usher release.

- Colour palette: two hues, one brand and one accent per register (0001)
- Logotype: wordmark plus abstract mark (0002)
- Motion language: one scale, two tempos (0003)
- Typography: display face plus workhorse sans (0004)

## Principles

- **One brand, two registers.** Shared tokens, audience-specific defaults.
- **Accessible by default.** WCAG 2.2 AA is the floor, not the target.
- **Mobile is the B2C primary.** Desktop is the B2B primary. Both are first-class.
- **Tokens before components.** Never hardcode a value a token should own.
- **Boring technology.** React, TypeScript, Tailwind. No novelty for its own sake.
- **Document as you build.** A component without docs is not done.

## Definition of success

A product engineer at Evento Livre can build a new Usher screen, for either
audience, using only this package and its docs, and the result looks and feels
unmistakably like Evento Livre.
