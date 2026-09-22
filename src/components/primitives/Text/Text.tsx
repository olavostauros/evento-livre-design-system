/**
 * Text: the typography primitive. Maps `variant` onto the `type-*` utilities
 * generated from `src/tokens/typography.ts`, so every run of text in a
 * product uses a named style and the per-register scale without knowing
 * which register it is in.
 *
 * - `variant` is a text style name (`body`, `title`, `numeric`, ...). The
 *   list is derived from the tokens, so it cannot drift.
 * - `as` picks the element. Each variant has a sensible default (`title`
 *   is an `h2`, `body` is a `p`) and the heading level is the caller's
 *   decision, because document outline is semantics, not style.
 * - `tone` is a foreground role: `fg`, `fg-muted`, `brand-fg`, the four
 *   status foregrounds. Every tone carries AA on canvas and surface
 *   (docs/foundations/colour.md).
 */

import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { textStyles, type TextStyleName } from "../../../tokens/typography.ts";
import { cn } from "../../../utils/cn.ts";

export const textVariants = Object.keys(textStyles) as readonly TextStyleName[];
export type TextVariant = TextStyleName;

export const textTones = [
  "default",
  "muted",
  "subtle",
  "inverse",
  "brand",
  "success",
  "warning",
  "danger",
  "info",
] as const;
export type TextTone = (typeof textTones)[number];

export const textAligns = ["start", "center", "end"] as const;
export type TextAlign = (typeof textAligns)[number];

export const textElements = [
  "p",
  "span",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "label",
  "code",
  "strong",
  "em",
  "small",
  "figcaption",
  "legend",
] as const;
export type TextElement = (typeof textElements)[number];

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Named text style from the typography tokens. Defaults to `body`. */
  readonly variant?: TextVariant;
  /** Element to render. Defaults per variant (see `defaultElements`). */
  readonly as?: TextElement;
  /** Foreground role. Defaults to `default` (`fg`). */
  readonly tone?: TextTone;
  /** Horizontal alignment. Unset inherits. */
  readonly align?: TextAlign;
  /** Single line with an ellipsis. The element needs a bounded width. */
  readonly truncate?: boolean;
  readonly children: ReactNode;
}

/** Element per variant when `as` is not given. Headings pick a level the caller can override. */
export const defaultElements: Readonly<Record<TextVariant, TextElement>> = {
  "display-xl": "h1",
  "display-lg": "h1",
  title: "h2",
  heading: "h2",
  subheading: "h3",
  body: "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
  overline: "span",
  numeric: "span",
  code: "code",
};

const toneClasses: Readonly<Record<TextTone, string>> = {
  default: "text-fg",
  muted: "text-fg-muted",
  subtle: "text-fg-subtle",
  inverse: "text-fg-inverse",
  brand: "text-brand-fg",
  success: "text-status-success-fg",
  warning: "text-status-warning-fg",
  danger: "text-status-danger-fg",
  info: "text-status-info-fg",
};

const alignClasses: Readonly<Record<TextAlign, string>> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

export function Text({
  variant = "body",
  as,
  tone = "default",
  align,
  truncate = false,
  className,
  children,
  ...rest
}: TextProps) {
  const element = as ?? defaultElements[variant];
  return createElement(
    element,
    {
      ...rest,
      className: cn(
        `type-${variant}`,
        variant === "overline" && "uppercase",
        toneClasses[tone],
        align && alignClasses[align],
        truncate && "truncate",
        className,
      ),
      "data-variant": variant,
      "data-tone": tone,
    },
    children,
  );
}
