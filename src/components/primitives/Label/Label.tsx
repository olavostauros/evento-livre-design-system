/**
 * Label: the caption of a form control. A native `<label>` in the `label`
 * text style, so the association with its control is real (clicking
 * focuses, assistive tech reads the name) and the size follows the
 * register.
 *
 * - `required` shows a marker. It is decorative; the control's own
 *   `required` attribute carries the semantics.
 * - Pair by `htmlFor` (preferred, works across layouts) or by wrapping
 *   the control.
 */

import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn.ts";

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> {
  /** Show the required marker. Set `required` on the control too. */
  readonly required?: boolean;
  readonly children: ReactNode;
}

const base = "inline-block type-label text-fg select-none";

export function Label({ required = false, className, children, ...rest }: LabelProps) {
  return (
    <label {...rest} className={cn(base, className)} data-required={required || undefined}>
      {children}
      {required && (
        <span aria-hidden="true" data-slot="required" className="ms-1 text-status-danger-fg">
          *
        </span>
      )}
    </label>
  );
}
