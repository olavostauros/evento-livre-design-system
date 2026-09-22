/**
 * Corner radii (0006, soft and rounded). One scale, plus roles so a
 * component says `rounded-control` and the personality can change in one
 * place. The mark and icons follow the same corner logic at their scale.
 */

/** px. `full` is a pill. */
export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 28,
  full: 9999,
} as const;

export type Radius = keyof typeof radii;

export const radiusRoles = {
  /** Buttons, inputs, selects, small menus. */
  control: "md",
  /** Cards, panels, popovers. */
  container: "lg",
  /** Bottom sheets, dialogs, large surfaces. */
  sheet: "xl",
  /** Badges, chips, avatars, toggles. */
  chip: "full",
} as const satisfies Record<string, Radius>;

export type RadiusRole = keyof typeof radiusRoles;
