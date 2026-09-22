# Tokens

Single source of truth for design values. `scripts/build-theme.ts` reads
`index.ts` and writes `src/styles/theme.css` (Tailwind v4 `@theme`, see 0005).

Expected files, all unblocked as of 2026-09-22:

- `colors.ts`     0001: brand deep teal-blue, accent-b2b cool, accent-b2c warm, neutrals, semantics
- `typography.ts` 0004: Geist workhorse, Bricolage Grotesque display, scale per register
- `spacing.ts`    0006: 4px base, one shared scale
- `radii.ts`      0006: soft rounded, xs to full
- `elevation.ts`  0006: levels 0 to 3, light shadows, dark surface tints
- `motion.ts`     0003: durations, easings, distances, tempos
- `index.ts`      re-exports
