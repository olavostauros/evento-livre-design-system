# 0003. Motion language

- **Status:** accepted (temporary, revisit before first Usher release)
- **Date:** 2026-09-22
- **Deciders:** owner (accepted recommendation as temporary)

## Context

Motion tells people what just happened and what to look at. Producers use the
product for hours and want feedback, not flourish. Attendees use it for
seconds and remember the flourish. Both must respect `prefers-reduced-motion`.

Constraints that apply to every option:

- Every animated component has a reduced-motion path that keeps the meaning.
- Durations and easings are tokens in `src/tokens/motion.ts`. Nothing is
  hardcoded in a component.
- No motion on data-dense B2B surfaces beyond state feedback (hover, focus,
  loading, row expand).
- Motion must never block input. Nothing waits for an animation to finish
  before a tap is accepted.

The implementation library is a sub-decision. CSS transitions and keyframes
cover Options A and C. Option B needs a physics library (Motion, formerly
framer-motion, or react-spring), which requires its own dependency record.

## Options considered

### Option A. Functional only

A small scale: three durations (fast 100ms, base 180ms, slow 300ms), two
easings (standard ease-out for entering, ease-in for leaving), and a fixed
set of transitions: fade, slide-up 8px, scale 0.96 to 1. Used only for
state changes, overlays, and page-level enter. Same everywhere.

- Pros: tiny, predictable, CSS-only, trivially reduced-motion safe. Right
  for B2B out of the box.
- Cons: B2C feels flat. No signature moment. Nothing that makes an attendee
  screenshot the app.

### Option B. Expressive, physics-based

Spring-based motion with shared-element transitions (event card expands into
event page, ticket slides up from the bottom sheet), staggered lists, and a
signature "reveal" for the ticket QR. B2B gets a reduced subset. Requires a
physics library.

- Pros: memorable B2C. Continuity between screens helps attendees in a hurry.
  Marketing loves it.
- Cons: bundle weight, two registers to maintain, easy to overuse. Springs are
  harder to make reduced-motion safe. Performance risk on cheap Android
  phones, which is much of the B2C audience in Brazil.

### Option C. One scale, two tempos

A shared token scale (durations, easings, distances) with a **tempo**
multiplier per register: B2B runs at 0.7x, B2C at 1x. Same transitions, same
components, different feel. One signature motion (the ticket reveal) is
allowed to exceed the scale, and only on B2C. CSS-first; a physics library
may be added later for the signature moment only.

- Pros: expresses "one system, two registers" directly in tokens, the same
  way 0001 Option B does for colour. Keeps B2B fast, gives B2C room. Reduced
  motion is a third tempo (0x for movement, instant fades only).
- Cons: multiplier is a concept engineers must learn. Signature motion still
  needs a separate approval and possibly a dependency.

## Recommendation

Option C. It matches the colour recommendation structurally, stays CSS-only
until proven otherwise, and leaves a door open for one memorable B2C moment
without committing to a physics library today. Define the scale as tokens
first, then build one B2C screen and one B2B screen to feel the tempos.

## Decision

Option C, one scale with two tempos, **accepted as temporary** on
2026-09-22. CSS-only. B2B tempo 0.7x, B2C tempo 1x, reduced motion 0x with
instant fades. One signature moment (ticket reveal) allowed on B2C only, and
it still needs its own approval before any library is added.

This is provisional. Tempo values and the signature moment may change without
a superseding record until the first Usher screens ship.

## Consequences

Now unblocked: `src/tokens/motion.ts`, a `useReducedMotion` hook in
`src/hooks/`, presets in `src/motion/`, and `docs/foundations/motion.md`.
Any library requires its own decision record.
