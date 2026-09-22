/**
 * Colour maths shared by tokens, tests and components.
 * Pure functions, no DOM. Hex in, numbers out.
 */

export type Hex = `#${string}`;

const channel = (hex: Hex, offset: number): number =>
  Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;

const linearise = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;

/** WCAG 2.x relative luminance of an sRGB hex colour (`#RRGGBB`). */
export function relativeLuminance(hex: Hex): number {
  const r = linearise(channel(hex, 1));
  const g = linearise(channel(hex, 3));
  const b = linearise(channel(hex, 5));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two hex colours, from 1 to 21. */
export function contrastRatio(a: Hex, b: Hex): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** WCAG 2.2 AA thresholds. */
export const AA = {
  /** Body text under 18pt regular or 14pt bold. */
  text: 4.5,
  /** Large text, UI component boundaries, focus indicators. */
  large: 3,
} as const;
