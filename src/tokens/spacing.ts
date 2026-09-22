/**
 * Spacing tokens (0006): a 4px base unit and one shared numeric scale
 * (Tailwind's `p-4` is 16px). Density is a set of named values per
 * register so components say `p-inset-md` and get 16px on B2C or 12px on
 * B2B without knowing which. Never a second scale.
 */

import type { Register } from "./colors.ts";

/** px. Tailwind's `--spacing` multiplier. */
export const spacingBase = 4;

export const densityKeys = [
  "control-sm",
  "control-md",
  "control-lg",
  "inset-sm",
  "inset-md",
  "inset-lg",
  "stack-sm",
  "stack-md",
  "stack-lg",
  "gutter",
] as const;

export type DensityKey = (typeof densityKeys)[number];

/**
 * px. `control-*` are heights of buttons, inputs and rows. B2C `control-md`
 * is 44px, the recommended touch target; B2B may go down to 28px (WCAG 2.5.8
 * minimum is 24px). `inset-*` is padding inside a component, `stack-*` is
 * the gap between siblings, `gutter` is the page side margin.
 */
export const density: Readonly<Record<Register, Readonly<Record<DensityKey, number>>>> = {
  b2c: {
    "control-sm": 36,
    "control-md": 44,
    "control-lg": 52,
    "inset-sm": 12,
    "inset-md": 16,
    "inset-lg": 24,
    "stack-sm": 8,
    "stack-md": 12,
    "stack-lg": 16,
    gutter: 16,
  },
  b2b: {
    "control-sm": 28,
    "control-md": 32,
    "control-lg": 40,
    "inset-sm": 8,
    "inset-md": 12,
    "inset-lg": 16,
    "stack-sm": 4,
    "stack-md": 8,
    "stack-lg": 12,
    gutter: 24,
  },
};
