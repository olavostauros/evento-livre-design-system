/**
 * Field: one labelled form control with an optional description and error.
 * Composes `Label`, `Text` and whatever control is passed as children, and
 * does the wiring the primitives leave to the caller: a shared id, the
 * label's `for`, `aria-describedby` pointing at the description and the
 * error, `aria-invalid` when there is an error, `required` on both label
 * and control.
 *
 * The control receives the wiring through `FieldContext`
 * (`src/hooks/useFieldControl.ts`). `Input` reads it; later controls opt
 * in the same way. Explicit props on the control still win.
 *
 * DOM order is label, description, control, error. The description is read
 * before typing, the error sits where the eye lands after typing, and
 * `aria-describedby` lists them in that order so the reason follows the hint.
 */

import { useId, type HTMLAttributes, type ReactNode } from "react";
import { FieldContext, type FieldControlProps } from "../../../hooks/useFieldControl.ts";
import { cn } from "../../../utils/cn.ts";
import { Label } from "../../primitives/Label/Label.tsx";
import { Text } from "../../primitives/Text/Text.tsx";

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The control's name. Rendered as a `Label` pointing at the control. */
  readonly label: ReactNode;
  /** A hint shown above the control and read before it. */
  readonly description?: ReactNode;
  /** The validation message, shown below the control. Also marks it invalid. */
  readonly error?: ReactNode;
  /** Required marker on the label and `required` on the control. */
  readonly required?: boolean;
  /** Base for the generated ids. `useId()` when omitted. */
  readonly id?: string;
  /** The control. One `Input` (or a later opt-in control). */
  readonly children: ReactNode;
}

const base = "flex flex-col gap-stack-sm";

export function Field({
  label,
  description,
  error,
  required = false,
  id,
  className,
  children,
  ...rest
}: FieldProps) {
  const generated = useId();
  const baseId = id ?? generated;
  const controlId = `${baseId}-control`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;

  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasError = error !== undefined && error !== null && error !== false;
  const describedBy = [hasDescription && descriptionId, hasError && errorId]
    .filter((v): v is string => typeof v === "string")
    .join(" ");

  const control: { -readonly [K in keyof FieldControlProps]: FieldControlProps[K] } = { id: controlId };
  if (describedBy) control["aria-describedby"] = describedBy;
  if (hasError) control["aria-invalid"] = true;
  if (required) control.required = true;

  return (
    <div {...rest} className={cn(base, className)} data-invalid={hasError || undefined}>
      <Label htmlFor={controlId} required={required}>
        {label}
      </Label>
      {hasDescription && (
        <Text as="p" variant="body-sm" tone="muted" id={descriptionId} data-slot="description">
          {description}
        </Text>
      )}
      <FieldContext.Provider value={control}>{children}</FieldContext.Provider>
      {hasError && (
        <Text as="p" variant="body-sm" tone="danger" id={errorId} data-slot="error">
          {error}
        </Text>
      )}
    </div>
  );
}
