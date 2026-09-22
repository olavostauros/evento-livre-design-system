# Motion

Motion primitives: duration and easing tokens, reduced-motion handling, and
reusable presets (fade, slide, scale). Governed by
`docs/decisions/0003-motion-language.md`. The tokens and the `animate-*`
presets already ship from `src/tokens/motion.ts` through the generated
theme; this folder is for JS-side helpers (a `useReducedMotion` hook lives
in `src/hooks/` when it lands) and is empty until one is needed.
