/**
 * Icon: the glyph container. It is the `<svg>` itself, fixed to the 24px
 * drawing grid and the shared stroke weight from `src/tokens/icons.ts`, so
 * every glyph in the system is drawn the same way (semiotics: same stroke
 * weight, corner logic and warmth as the mark). Children are the path
 * nodes; the component ships no glyphs, because the icon set waits on the
 * mark (0002).
 *
 * - `size` picks the rendered box: `sm` 16, `md` 20, `lg` 24.
 * - Decorative by default (`aria-hidden`). Give `label` when the icon is
 *   the only content, and it becomes `role="img"` with that name.
 * - Strokes are `currentColor`, so the icon takes the text tone around it.
 */

import type { ReactNode, SVGAttributes } from "react";
import { iconGrid, iconSizes, iconStrokeWidth, type IconSize } from "../../../tokens/icons.ts";
import { cn } from "../../../utils/cn.ts";

export const iconSizeNames = Object.keys(iconSizes) as readonly IconSize[];
export type { IconSize };

export interface IconProps
  extends Omit<
    SVGAttributes<SVGSVGElement>,
    "viewBox" | "width" | "height" | "children" | "aria-hidden" | "aria-label" | "role"
  > {
  /** Rendered box, from the icon size tokens. Defaults to `md`. */
  readonly size?: IconSize;
  /** Accessible name. Set it only when the icon carries meaning on its own. */
  readonly label?: string;
  /** Path nodes drawn on the 24px grid. */
  readonly children: ReactNode;
}

const sizeClasses: Readonly<Record<IconSize, string>> = {
  sm: "size-icon-sm",
  md: "size-icon-md",
  lg: "size-icon-lg",
};

export function Icon({ size = "md", label, className, children, ...rest }: IconProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
      {...a11y}
      viewBox={`0 0 ${iconGrid} ${iconGrid}`}
      className={cn("inline-block shrink-0 align-middle", sizeClasses[size], className)}
      data-size={size}
    >
      {children}
    </svg>
  );
}
