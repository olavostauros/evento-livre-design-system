/**
 * Button: the primary action primitive. A native `<button>` styled with
 * role utilities, so it follows theme and register without knowing either.
 *
 * - `variant` says what the action means: `primary` (the one thing to do),
 *   `secondary` (an alternative), `ghost` (quiet, inline), `danger`
 *   (destructive). Brand colour is reserved for primary (colour.md); the
 *   accent never appears on a button.
 * - `size` maps to the density tokens: `control-sm`, `control-md`,
 *   `control-lg`. B2C `md` is 44px, B2B `md` is 32px, same class.
 * - `loading` keeps the button in the tab order, marks it `aria-busy` and
 *   `aria-disabled`, swallows clicks, and swaps the start slot for a
 *   spinner. The label stays visible so the width does not jump.
 */

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "../../../utils/cn.ts";

export const buttonVariants = ["primary", "secondary", "ghost", "danger"] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["sm", "md", "lg"] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** What the action means. Defaults to `secondary`: primary is a choice, not a default. */
  readonly variant?: ButtonVariant;
  /** Height and padding, from the density tokens. Defaults to `md`. */
  readonly size?: ButtonSize;
  /** Stretch to the container. Sheet and form actions on B2C. */
  readonly fullWidth?: boolean;
  /**
   * The action is in progress. Announces busy, ignores clicks, shows a
   * spinner in place of `iconStart`. Keeps focus, unlike `disabled`.
   */
  readonly loading?: boolean;
  /** Decorative icon before the label. Rendered `aria-hidden`. */
  readonly iconStart?: ReactNode;
  /** Decorative icon after the label. Rendered `aria-hidden`. */
  readonly iconEnd?: ReactNode;
  /** The label. Text, always; an icon-only button needs `aria-label` too. */
  readonly children: ReactNode;
}

const base = cn(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
  "rounded-control border font-sans font-medium",
  "transition duration-fast ease-standard",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-busy:cursor-progress",
);

const variantClasses: Readonly<Record<ButtonVariant, string>> = {
  primary: cn(
    "border-transparent bg-brand-solid text-fg-inverse",
    "hover:bg-brand-700 active:bg-brand-800",
  ),
  secondary: cn(
    "border-border-strong bg-surface text-fg",
    "hover:bg-surface-sunken active:bg-surface-sunken active:border-fg",
  ),
  ghost: cn(
    "border-transparent bg-transparent text-fg-muted",
    "hover:bg-surface-sunken hover:text-fg active:bg-surface-sunken active:text-fg",
  ),
  danger: cn(
    "border-transparent bg-status-danger-solid text-fg-inverse",
    "hover:bg-danger-700 active:bg-danger-800",
  ),
};

const sizeClasses: Readonly<Record<ButtonSize, string>> = {
  sm: "h-control-sm px-inset-sm text-sm",
  md: "h-control-md px-inset-md text-sm",
  lg: "h-control-lg px-inset-lg text-base",
};

/**
 * Placeholder loading indicator. A plain arc does not pass the semiotics
 * test (docs/brand/semiotics.md: loading is "the hand before the phone is
 * raised"). Replace it with the drawn loader once the Icon primitive and
 * the mark exist; keep the `animate-spin` hook and the 1em size.
 */
function Spinner() {
  return (
    <svg
      aria-hidden="true"
      data-slot="spinner"
      className="size-4 shrink-0 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  loading = false,
  iconStart,
  iconEnd,
  children,
  className,
  type = "button",
  disabled,
  onClick,
  ...rest
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      type={type}
      className={cn(base, variantClasses[variant], sizeClasses[size], fullWidth && "w-full", className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      data-variant={variant}
      data-size={size}
      onClick={handleClick}
    >
      {loading ? (
        <Spinner />
      ) : (
        iconStart && (
          <span aria-hidden="true" data-slot="icon-start" className="inline-flex shrink-0">
            {iconStart}
          </span>
        )
      )}
      <span data-slot="label">{children}</span>
      {iconEnd && (
        <span aria-hidden="true" data-slot="icon-end" className="inline-flex shrink-0">
          {iconEnd}
        </span>
      )}
    </button>
  );
}
