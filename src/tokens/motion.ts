/**
 * Motion tokens (0003): one scale, two tempos. Durations and distances are
 * multiplied by the register's tempo at runtime, so the same transition
 * runs at 0.7x on a producer dashboard and 1x on an attendee's phone.
 * Reduced motion is a third tempo: 0, instant fades only. CSS only.
 */

import type { Register } from "./colors.ts";

/** ms, before tempo. */
export const durations = {
  instant: 0,
  fast: 100,
  base: 180,
  slow: 300,
  slower: 500,
} as const;

export type Duration = keyof typeof durations;

export const easings = {
  /** Default for anything that changes in place (colour, size, position). */
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  /** Entering: decelerate. */
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  /** Leaving: accelerate. */
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  /** One overshoot. B2C emphasis only, never on data surfaces. */
  emphasized: "cubic-bezier(0.34, 1.4, 0.64, 1)",
} as const;

export type Easing = keyof typeof easings;

/** px, before tempo. Reduced motion collapses these to 0. */
export const distances = {
  slide: 8,
  "slide-lg": 16,
} as const;

/** Scale factor for scale-in transitions. */
export const scaleEnter = 0.96;

/** Multiplier on durations and distances. */
export const tempos: Readonly<Record<Register | "reduced", number>> = {
  b2c: 1,
  b2b: 0.7,
  reduced: 0,
};

/** Keyframe presets, emitted as `animate-*` utilities. */
export const animations = {
  "fade-in": { duration: "base", easing: "enter" },
  "fade-out": { duration: "fast", easing: "exit" },
  "slide-up": { duration: "base", easing: "enter" },
  "scale-in": { duration: "base", easing: "enter" },
} as const satisfies Record<string, { duration: Duration; easing: Easing }>;

export type Animation = keyof typeof animations;
