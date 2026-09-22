/**
 * Typography tokens (0004, amended): Geist is the workhorse for all UI and
 * all of B2B; Bricolage Grotesque is the display face for B2C headlines,
 * event names and the wordmark. Both are variable, self-hosted
 * (`src/styles/fonts.css`), OFL.
 *
 * The size scale is one set of step names with values per register: the
 * same `text-base` is 16px on an attendee's phone and 14px in a producer's
 * table. Register-specific values are resolved at runtime by the nearest
 * `data-register` ancestor, like the accent colour.
 */

import type { Register } from "./colors.ts";

export const fontFamilies = {
  /** UI, body, B2B everything. */
  sans: ['"Geist"', "system-ui", "sans-serif"],
  /** B2C headlines, event names, the wordmark. Never on B2B surfaces. */
  display: ['"Bricolage Grotesque"', '"Geist"', "system-ui", "sans-serif"],
  /** Code, IDs, anything that must align character by character. */
  mono: ['"Geist Mono"', "ui-monospace", "monospace"],
} as const;

export type FontFamily = keyof typeof fontFamilies;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export type FontWeight = keyof typeof fontWeights;

/** Letter-spacing, in em. `tight` is for display sizes only. */
export const tracking = {
  tight: -0.02,
  normal: 0,
  wide: 0.04,
} as const;

export const typeSteps = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"] as const;
export type TypeStep = (typeof typeSteps)[number];

export interface TypeSize {
  /** px */
  readonly size: number;
  /** px */
  readonly lineHeight: number;
}

/**
 * Size per step per register, in px (emitted as rem). B2C is roomier and
 * mobile first; B2B is denser and desktop first. Nothing goes below 12px
 * (0004: readable at 12px in a dense table).
 */
export const typeScale: Readonly<Record<Register, Readonly<Record<TypeStep, TypeSize>>>> = {
  b2c: {
    xs: { size: 12, lineHeight: 16 },
    sm: { size: 14, lineHeight: 20 },
    base: { size: 16, lineHeight: 24 },
    lg: { size: 18, lineHeight: 28 },
    xl: { size: 20, lineHeight: 28 },
    "2xl": { size: 24, lineHeight: 32 },
    "3xl": { size: 30, lineHeight: 36 },
    "4xl": { size: 36, lineHeight: 40 },
    "5xl": { size: 48, lineHeight: 52 },
  },
  b2b: {
    xs: { size: 12, lineHeight: 16 },
    sm: { size: 13, lineHeight: 18 },
    base: { size: 14, lineHeight: 20 },
    lg: { size: 16, lineHeight: 22 },
    xl: { size: 18, lineHeight: 24 },
    "2xl": { size: 20, lineHeight: 26 },
    "3xl": { size: 24, lineHeight: 30 },
    "4xl": { size: 30, lineHeight: 34 },
    "5xl": { size: 36, lineHeight: 40 },
  },
};

export interface TextStyle {
  readonly family: FontFamily;
  readonly step: TypeStep;
  readonly weight: FontWeight;
  readonly tracking: keyof typeof tracking;
  /** Tabular, lining figures. For prices, counts and table cells. */
  readonly tabular?: boolean;
  /** Only rendered in the display face on B2C; falls back to sans on B2B. */
  readonly displayOnB2cOnly?: boolean;
}

/**
 * Named text styles, emitted as `type-*` utilities. The Text component will
 * map its `variant` prop onto these. Display styles use the display face on
 * B2C and the sans on B2B, because producers never see the display face.
 */
export const textStyles = {
  "display-xl": { family: "display", step: "5xl", weight: "bold", tracking: "tight", displayOnB2cOnly: true },
  "display-lg": { family: "display", step: "4xl", weight: "bold", tracking: "tight", displayOnB2cOnly: true },
  title: { family: "display", step: "3xl", weight: "semibold", tracking: "tight", displayOnB2cOnly: true },
  heading: { family: "sans", step: "2xl", weight: "semibold", tracking: "tight" },
  subheading: { family: "sans", step: "lg", weight: "semibold", tracking: "normal" },
  body: { family: "sans", step: "base", weight: "regular", tracking: "normal" },
  "body-sm": { family: "sans", step: "sm", weight: "regular", tracking: "normal" },
  label: { family: "sans", step: "sm", weight: "medium", tracking: "normal" },
  caption: { family: "sans", step: "xs", weight: "regular", tracking: "normal" },
  overline: { family: "sans", step: "xs", weight: "semibold", tracking: "wide" },
  numeric: { family: "sans", step: "base", weight: "medium", tracking: "normal", tabular: true },
  code: { family: "mono", step: "sm", weight: "regular", tracking: "normal" },
} as const satisfies Record<string, TextStyle>;

export type TextStyleName = keyof typeof textStyles;
