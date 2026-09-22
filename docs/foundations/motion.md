# Motion

Implements `docs/decisions/0003-motion-language.md`: one scale, two tempos,
CSS only. Values live in `src/tokens/motion.ts`. Experimental as of
2026-09-22.

## Tempo

Every duration and distance is multiplied by `--el-tempo`, set by the
nearest `data-register`:

| Context | Tempo | 180ms becomes |
|---|---|---|
| B2C (default) | 1 | 180ms |
| B2B | 0.7 | 126ms |
| `prefers-reduced-motion` | 0 | 0ms, movement collapses, fades are instant |

The multiplication happens inside each utility, so a B2B panel inside a B2C
page (or the reverse) gets its own tempo without any component knowing.

## Scale

| Duration | ms before tempo | Tailwind | Use |
|---|---|---|---|
| instant | 0 | `duration-instant` | opt out of a transition |
| fast | 100 | `duration-fast` | hover, focus, pressed |
| base | 180 | `duration-base` (default) | most state changes, enter |
| slow | 300 | `duration-slow` | overlays, sheets, page-level enter |
| slower | 500 | `duration-slower` | B2C only: signature moments |

| Easing | Curve | Tailwind | Use |
|---|---|---|---|
| standard | 0.2, 0, 0, 1 | `ease-standard` (default) | change in place |
| enter | 0, 0, 0.2, 1 | `ease-enter` | arriving |
| exit | 0.4, 0, 1, 1 | `ease-exit` | leaving |
| emphasized | 0.34, 1.4, 0.64, 1 | `ease-emphasized` | one overshoot, B2C emphasis only |

Distances: slide 8px, slide-lg 16px. Scale-in starts at 0.96. Both are
multiplied by tempo, so reduced motion collapses them to nothing.

## Presets

`animate-fade-in`, `animate-fade-out`, `animate-slide-up`, `animate-scale-in`
run once with `both` fill. `transition` alone uses the base duration and the
standard easing at the register's tempo.

## Rules

- Nothing blocks input. A tap is accepted while an animation runs.
- B2B surfaces animate only state feedback: hover, focus, loading, expand.
- `emphasized` and `slower` never appear on data-dense surfaces.
- The B2C signature moment (the ticket reveal, the hand offering the phone)
  is allowed to exceed the scale and still needs its own approval before any
  library is added.
- Every animated component keeps its meaning at tempo 0. If a state is only
  communicated by movement, it is wrong.
