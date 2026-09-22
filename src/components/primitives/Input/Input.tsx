/**
 * Input: the single-line text field. A native `<input>` for text-like
 * types, styled with role and density utilities so one component serves
 * both registers and both themes.
 *
 * - `size` maps to the density tokens like Button: `control-sm/md/lg`.
 *   `md` and `lg` set `text-base`, which is 16px on B2C, because iOS
 *   Safari zooms the page into any focused field whose font is smaller.
 *   `sm` is `text-sm` and is for dense B2B toolbars, not phones.
 * - `invalid` sets `aria-invalid` and a danger border in the `*-fg` role,
 *   which stays AA on canvas and surface in both themes, so the boundary
 *   keeps 3:1. Pair it with a visible message; colour is never the only
 *   signal.
 * - Inside a `Field` pattern the input reads `id`, `aria-describedby`,
 *   `aria-invalid` and `required` from `FieldContext`. Explicit props win.
 *   Outside a Field nothing changes.
 * - Always full width. The field or the layout decides the width.
 * - Checkbox, radio, file and buttons are other primitives.
 */

import type { InputHTMLAttributes } from "react";
import { useFieldControl, type FieldControlProps } from "../../../hooks/useFieldControl.ts";
import { cn } from "../../../utils/cn.ts";

export const inputTypes = [
  "text",
  "email",
  "password",
  "search",
  "tel",
  "url",
  "number",
  "date",
  "time",
  "datetime-local",
] as const;
export type InputType = (typeof inputTypes)[number];

export const inputSizes = ["sm", "md", "lg"] as const;
export type InputSize = (typeof inputSizes)[number];

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children"> {
  /** Text-like types only. Defaults to `text`. */
  readonly type?: InputType;
  /** Height, padding and font size, from the density tokens. Defaults to `md`. */
  readonly size?: InputSize;
  /** The value fails validation. Sets `aria-invalid`; add a visible message. Inherited from `Field` when unset. */
  readonly invalid?: boolean;
}

const base = cn(
  "block w-full min-w-0 appearance-none",
  "rounded-control border border-border-strong bg-surface text-fg font-sans",
  "placeholder:text-fg-subtle",
  "transition duration-fast ease-standard",
  "outline-none focus:outline-2 focus:outline-offset-2 focus:outline-ring",
  "aria-invalid:border-status-danger-fg",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "read-only:bg-surface-sunken",
);

const sizeClasses: Readonly<Record<InputSize, string>> = {
  sm: "h-control-sm px-inset-sm text-sm",
  md: "h-control-md px-inset-md text-base",
  lg: "h-control-lg px-inset-lg text-base",
};

export function Input({
  type = "text",
  size = "md",
  invalid,
  className,
  id,
  required,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: InputProps) {
  const own: { -readonly [K in keyof FieldControlProps]: FieldControlProps[K] } = {};
  if (id !== undefined) own.id = id;
  if (ariaDescribedBy !== undefined) own["aria-describedby"] = ariaDescribedBy;
  if (invalid) own["aria-invalid"] = true;
  if (required) own.required = true;
  const wired = useFieldControl(own);
  // `invalid={false}` is an explicit answer and overrides the Field.
  const isInvalid = invalid ?? wired["aria-invalid"] === true;

  return (
    <input
      {...rest}
      {...wired}
      type={type}
      className={cn(base, sizeClasses[size], className)}
      aria-invalid={isInvalid || undefined}
      data-size={size}
      data-invalid={isInvalid || undefined}
    />
  );
}
