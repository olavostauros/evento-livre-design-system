/**
 * Icon tokens. The glyphs themselves are governed by docs/brand/semiotics.md
 * and are not drawn yet (0002); these are the sizes and the drawing grid
 * every glyph will share, so the Icon primitive can exist before the set.
 */

/** px. Rendered box of an icon. Multiples of the 4px spacing base. */
export const iconSizes = {
  /** Inline with `text-sm`; Button `sm`, badges, table cells. */
  sm: 16,
  /** Inline with `text-base`; the default. */
  md: 20,
  /** Standalone, toolbars, empty states. */
  lg: 24,
} as const;

export type IconSize = keyof typeof iconSizes;

/** px. Side of the viewBox every glyph is drawn on. */
export const iconGrid = 24;

/**
 * Stroke width on the grid, in px. Temporary: the mark (0002) fixes the
 * stroke weight, and icons must match it (semiotics). Change here, never
 * in a glyph.
 */
export const iconStrokeWidth = 1.5;
