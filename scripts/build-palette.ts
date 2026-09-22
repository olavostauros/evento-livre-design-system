/**
 * Generates the colour scales in `src/tokens/colors.ts` from an OKLCH recipe.
 *
 * Usage: `bun run build:palette` prints a TypeScript snippet and a contrast
 * table. Paste the snippet into `src/tokens/colors.ts` (the `palette` block)
 * and the table into `docs/foundations/colour.md`. This is run by hand when
 * a hue changes (see 0001); it is not part of the build.
 *
 * Recipe: every scale shares one lightness ramp and one chroma curve, so
 * swapping a hue keeps contrast behaviour identical. Chroma is clipped to
 * the sRGB gamut per step.
 */

import { contrastRatio } from "../src/utils/color.ts";
import type { Hex } from "../src/utils/color.ts";

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEPS)[number];

/** OKLCH lightness per step. 600 is the first step that carries white text at AA. */
const LIGHTNESS: Record<Step, number> = {
  50: 0.975, 100: 0.945, 200: 0.89, 300: 0.82, 400: 0.72, 500: 0.62,
  600: 0.53, 700: 0.45, 800: 0.38, 900: 0.31, 950: 0.24,
};

/** Fraction of the hue's peak chroma per step. Peaks at 500. */
const CHROMA_CURVE: Record<Step, number> = {
  50: 0.12, 100: 0.25, 200: 0.45, 300: 0.65, 400: 0.85, 500: 1,
  600: 0.98, 700: 0.9, 800: 0.78, 900: 0.62, 950: 0.48,
};

/**
 * Hue (OKLCH degrees) and peak chroma per role. Roles, not hue names, so
 * 0001 can be revisited by editing two numbers. Hues are spaced at least
 * 35 degrees apart so every pair stays distinguishable, including the
 * pairs that colour-vision deficiency compresses.
 */
const RECIPE = {
  brand: { hue: 218, chroma: 0.13 },      // deep teal-blue (0001, amended)
  accentB2b: { hue: 268, chroma: 0.17 },  // cool: blue-indigo, clear of teal
  accentB2c: { hue: 350, chroma: 0.19 },  // warm: hot pink, clear of orange and yellow
  success: { hue: 150, chroma: 0.15 },    // green, 68 degrees from brand
  warning: { hue: 72, chroma: 0.16 },     // amber
  danger: { hue: 27, chroma: 0.19 },      // orange-red, 37 degrees from accent-b2c
  info: { hue: 305, chroma: 0.17 },       // purple; a blue info would sit on the brand
  neutral: { hue: 75, chroma: 0.006, flat: true }, // barely warm grey
} as const;

export type Role = keyof typeof RECIPE;

type Rgb = [number, number, number];

function oklchToLinearRgb(l: number, c: number, h: number): Rgb {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

const inGamut = (rgb: Rgb): boolean => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

function encode(v: number): string {
  const clamped = Math.min(1, Math.max(0, v));
  const srgb = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(srgb * 255).toString(16).padStart(2, "0").toUpperCase();
}

/** OKLCH to hex, reducing chroma until the colour fits in sRGB. */
export function oklchToHex(l: number, c: number, h: number): Hex {
  let chroma = c;
  let rgb = oklchToLinearRgb(l, chroma, h);
  while (!inGamut(rgb) && chroma > 0) {
    chroma = Math.max(0, chroma - 0.002);
    rgb = oklchToLinearRgb(l, chroma, h);
  }
  return `#${rgb.map(encode).join("")}`;
}

export function buildScale(role: Role): Record<Step, Hex> {
  const { hue, chroma } = RECIPE[role];
  const flat = "flat" in RECIPE[role];
  const scale = {} as Record<Step, Hex>;
  for (const step of STEPS) {
    const c = flat ? chroma : chroma * CHROMA_CURVE[step];
    scale[step] = oklchToHex(LIGHTNESS[step], c, hue);
  }
  return scale;
}

export function buildPalette(): Record<Role, Record<Step, Hex>> {
  const out = {} as Record<Role, Record<Step, Hex>>;
  for (const role of Object.keys(RECIPE) as Role[]) out[role] = buildScale(role);
  return out;
}

if (import.meta.main) {
  const palette = buildPalette();
  const white: Hex = "#FFFFFF";
  const ink = palette.neutral[950];

  console.log("// ---- paste into src/tokens/colors.ts ----");
  for (const [role, scale] of Object.entries(palette)) {
    console.log(`  ${role}: {`);
    for (const step of STEPS) console.log(`    ${step}: "${scale[step]}",`);
    console.log("  },");
  }

  console.log("\n<!-- ---- paste into docs/foundations/colour.md ---- -->");
  for (const [role, scale] of Object.entries(palette)) {
    console.log(`\n### ${role}\n`);
    console.log("| Step | Hex | vs white | vs dark canvas |");
    console.log("|---|---|---|---|");
    for (const step of STEPS) {
      const v = scale[step];
      const onWhite = contrastRatio(v, white).toFixed(2);
      const onInk = contrastRatio(v, ink).toFixed(2);
      console.log(`| ${step} | \`${v}\` | ${onWhite} | ${onInk} |`);
    }
  }
}
