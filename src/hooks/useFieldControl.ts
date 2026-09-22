/**
 * useFieldControl: the bridge between the `Field` pattern and a form
 * control. `Field` provides the wired attributes (the control's `id`, the
 * ids of its description and error, `aria-invalid`, `required`) through
 * `FieldContext`. A control calls the hook with its own props and gets
 * back the merged set: explicit props win, the Field fills the gaps.
 * Outside a Field the hook returns the control's props untouched.
 *
 * Lives in `hooks/` so a primitive never imports from `patterns/`.
 */

import { createContext, useContext } from "react";

export interface FieldControlProps {
  /** The control's `id`, which the Field's `<label for>` points at. */
  readonly id?: string;
  /** Space-separated ids of the description and error, in that order. */
  readonly "aria-describedby"?: string;
  /** Set when the Field has an error. */
  readonly "aria-invalid"?: true;
  /** Set when the Field is required. */
  readonly required?: true;
}

export const FieldContext = createContext<FieldControlProps | null>(null);

/**
 * Merge a control's own props with the nearest Field's. Own values win.
 * `aria-describedby` is the exception: both are kept, own ids first, so a
 * product can add a description without losing the Field's.
 */
export function useFieldControl(own: FieldControlProps): FieldControlProps {
  const field = useContext(FieldContext);
  if (!field) return own;

  const describedBy = [own["aria-describedby"], field["aria-describedby"]]
    .filter((ids): ids is string => Boolean(ids))
    .join(" ");

  const merged: { -readonly [K in keyof FieldControlProps]: FieldControlProps[K] } = {};
  const id = own.id ?? field.id;
  if (id !== undefined) merged.id = id;
  if (describedBy) merged["aria-describedby"] = describedBy;
  if (own["aria-invalid"] ?? field["aria-invalid"]) merged["aria-invalid"] = true;
  if (own.required ?? field.required) merged.required = true;
  return merged;
}
