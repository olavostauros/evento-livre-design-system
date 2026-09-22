# CLAUDE.md

Guidance for the agent building the Evento Livre design system.
Read `MISSION.md` first. It says why this exists and who it serves.

## What this repo is

The shared design system for Evento Livre products, starting with Usher.
It ships design tokens, brand assets, and React components for two audiences:
B2B (event producers) and B2C (event goers).

## Stack

- **React** function components only. No class components.
- **TypeScript** strict mode. No `any`. Export prop types alongside components.
- **Tailwind CSS v4** for styling. Tokens live in `src/tokens/` and are
  compiled into `src/styles/theme.css` (a `@theme` block) by
  `scripts/build-theme.ts`. There is no `tailwind.config.ts`. Components use
  Tailwind classes, never inline styles or raw hex values.
- **Bun** is the package manager, bundler and test runner (see 0005). The
  docs tool is not chosen yet; record the choice in `docs/decisions/` before
  adding one.

## Layout

```
MISSION.md              why, who, what
CLAUDE.md               this file
docs/
  decisions/            one file per decision (ADR style), numbered
  brand/                semiotics (read first), logotype, voice, usage rules
  foundations/          colour, type, spacing, motion guidance
  components/           per-component usage docs
scripts/
  build-theme.ts        generates src/styles/theme.css from src/tokens/
  build-palette.ts      OKLCH recipe that prints the colour scales for colors.ts
src/
  tokens/               single source of truth for design values, with tests
  brand/logotype/       logotype source files and exports
  motion/               motion primitives (durations, easings, presets)
  styles/               Tailwind entry, fonts.css + fonts/, generated theme.css
  components/
    primitives/         Button, Input, Text, Icon, ...
    patterns/           composed pieces: Form, Card, Modal, DataTable, ...
    b2b/                producer-facing compositions
    b2c/                attendee-facing compositions
  hooks/                shared React hooks
  utils/                cn(), variant helpers, colour maths (contrast), etc.
```

## Brand decisions are temporary

The four brand-defining decisions in `docs/decisions/` (colour palette,
logotype, motion language, typography) and the shape decision (0006) are
**accepted as temporary** as of 2026-09-22. Build on them, but build so they
can be swapped:

- Name tokens by role (`brand-primary`, `accent-b2c`), never by hue.
- Keep the `Logo` component's API independent of the artwork.
- Put every font, duration and easing behind a token.
- Values that differ by register (accent, type size, density, tempo) or by
  theme (colour roles, shadows) are runtime custom properties switched by
  `data-register` and `data-theme`. Components stay register-agnostic.

Each record says what may change without a new record and what may not.
When one is revisited, update the record and supersede it properly. Do not
promote a temporary decision to final on your own.

Any new decision that constrains future work still needs its own record.

## Semiotics: how non-verbal tokens mean

Read `docs/brand/semiotics.md` before generating any non-typographic,
non-verbal token: the mark, icons, illustration, motion signatures, empty,
loading, success and error states, app icons.

The short version:

- The Evento Livre sign is an **index** of one moment: the attendee entering
  an event by showing their phone to be validated.
- It depicts only the attendee's **hand** and **phone**, presented forward.
- It never depicts the employee, the scanner, a QR code as hero, a gate, a
  turnstile, a paper ticket, or a lone checkmark.
- Its message is "Evento Livre is here to validate you into the event".
- It must be intuitive (readable in under a second with no caption), simple
  (one colour, 16px), warm (a human hand, not a diagram), forward-facing.

Every non-verbal token must pass the four-question test at the end of the
semiotics doc. Typography and copy are governed elsewhere; this is only for
what is seen and not read.

## Working rules

- **Tokens first.** If a value is not in `src/tokens/`, add it there before
  using it. The Tailwind theme is generated from tokens, never edited by hand.
  Run `bun run build:theme` after touching tokens; `bun run check` must pass.
- **Roles over palette.** Surfaces, text and borders use role utilities
  (`bg-canvas`, `text-fg-muted`, `border-border-strong`), which switch with
  theme and register. Reach into `brand-*`, `accent-*` and status scales
  only as `docs/foundations/colour.md` allows.
- **One component, one folder.** `ComponentName/ComponentName.tsx`,
  `index.ts`, tests, and a doc entry in `docs/components/`.
- **Accessibility is not optional.** Keyboard, focus, ARIA, contrast (AA).
  Prefer native elements. Use Radix-style headless patterns only if a
  decision record approves the dependency.
- **Two audiences, one system.** Shared primitives. If B2B and B2C truly need
  different defaults, express it as a variant or a theme, never as a fork.
- **Mobile first for B2C, desktop first for B2B.** Test both.
- **Document as you build.** No component is done without a docs entry and
  at least one usage example.
- **Record decisions.** Anything that constrains future work gets a numbered
  file in `docs/decisions/`. Copy `0000-template.md`.
- **Small commits, clear messages.** One concern per commit.

## Do not

- Do not hardcode colours, spacing, durations or font sizes in components.
- Do not add dependencies without a decision record.
- Do not design for products that do not exist yet. Usher is the customer.
- Do not promote the temporary brand decisions to final without sign-off.
- Do not create files outside the layout above without updating this file.

## Where to start

1. Read `MISSION.md`.
2. Read every file in `docs/decisions/`.
3. Check `src/tokens/` for what exists.
4. Pick the smallest useful next step and do that.
