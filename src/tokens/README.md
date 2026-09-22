# Tokens

Single source of truth for design values. `scripts/build-theme.ts` reads
`index.ts` and writes `src/styles/theme.css` (Tailwind v4 `@theme`, see 0005).
`bun run check:theme` fails when the generated file is stale.

| File | Contents | Record | Doc |
|---|---|---|---|
| `colors.ts` | brand, accent-b2b, accent-b2c, neutral, four status scales; roles per theme; register alias | 0001 | `docs/foundations/colour.md` |
| `typography.ts` | Geist, Bricolage Grotesque, Geist Mono; per-register size scale; text styles | 0004 | `docs/foundations/typography.md` |
| `spacing.ts` | 4px base; per-register density (control, inset, stack, gutter) | 0006 | `docs/foundations/shape.md` |
| `radii.ts` | xs to full; roles control, container, sheet, chip | 0006 | `docs/foundations/shape.md` |
| `elevation.ts` | levels 0 to 3; light shadows; dark hairlines | 0006 | `docs/foundations/shape.md` |
| `motion.ts` | durations, easings, distances, tempos, presets | 0003 | `docs/foundations/motion.md` |
| `index.ts` | re-exports | | |

Each token file has a colocated `*.test.ts` that enforces the guarantees its
foundations doc makes.

Values that differ by register (accent, type scale, density, tempo) are
emitted as `--el-*` custom properties switched by `data-register`; values
that differ by theme (colour roles, shadows) are switched by `data-theme`
or the OS preference. Components never know which register or theme they
are in.
