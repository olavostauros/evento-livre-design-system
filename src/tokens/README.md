# Tokens

Single source of truth for design values. `scripts/build-theme.ts` reads
`index.ts` and writes `src/styles/theme.css` (Tailwind v4 `@theme`, see 0005).
`bun run check:theme` fails when the generated file is stale.

| File | Status | Record |
|---|---|---|
| `colors.ts` | done: brand, accent-b2b, accent-b2c, neutral, four status scales, roles per theme, register alias | 0001 |
| `typography.ts` | pending: Geist workhorse, Bricolage Grotesque display, scale per register | 0004 |
| `spacing.ts` | pending: 4px base, one shared scale | 0006 |
| `radii.ts` | pending: soft rounded, xs to full | 0006 |
| `elevation.ts` | pending: levels 0 to 3, light shadows, dark surface tints | 0006 |
| `motion.ts` | pending: durations, easings, distances, tempos | 0003 |
| `index.ts` | re-exports | |

Each token file has a colocated `*.test.ts` that enforces the guarantees its
foundations doc makes (for colour: every AA claim).
