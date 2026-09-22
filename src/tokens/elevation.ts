/**
 * Elevation (0006): four levels. Light theme uses soft, layered,
 * low-opacity shadows. Dark theme lightens the surface per level and adds a
 * hairline; its shadows are near-invisible and only separate overlays from
 * the canvas. Each level pairs a surface role with a shadow so `elevation-2`
 * is one utility, not two.
 */

import type { Theme, ThemeRoles } from "./colors.ts";

export const elevationLevels = [0, 1, 2, 3] as const;
export type ElevationLevel = (typeof elevationLevels)[number];

export interface ShadowLayer {
  /** px */
  readonly x: number;
  readonly y: number;
  readonly blur: number;
  readonly spread: number;
  /** 0 to 1, applied to the theme's shadow colour. */
  readonly alpha: number;
}

/** Which surface role each level sits on. Level 0 is the canvas itself. */
export const elevationSurface: Readonly<
  Record<ElevationLevel, keyof Pick<ThemeRoles, "canvas" | "surface" | "surfaceRaised" | "surfaceOverlay">>
> = {
  0: "canvas",
  1: "surface",
  2: "surfaceRaised",
  3: "surfaceOverlay",
};

export const shadows: Readonly<Record<Theme, Readonly<Record<ElevationLevel, readonly ShadowLayer[]>>>> = {
  light: {
    0: [],
    1: [
      { x: 0, y: 1, blur: 2, spread: 0, alpha: 0.06 },
      { x: 0, y: 1, blur: 3, spread: 0, alpha: 0.08 },
    ],
    2: [
      { x: 0, y: 2, blur: 4, spread: 0, alpha: 0.06 },
      { x: 0, y: 8, blur: 16, spread: -2, alpha: 0.1 },
    ],
    3: [
      { x: 0, y: 8, blur: 16, spread: -4, alpha: 0.1 },
      { x: 0, y: 24, blur: 48, spread: -8, alpha: 0.18 },
    ],
  },
  dark: {
    0: [],
    1: [],
    2: [{ x: 0, y: 8, blur: 24, spread: -4, alpha: 0.4 }],
    3: [{ x: 0, y: 24, blur: 64, spread: -8, alpha: 0.6 }],
  },
};

/** Levels that also draw a hairline in the dark theme (0006). */
export const darkHairlineLevels: readonly ElevationLevel[] = [1, 2, 3];
