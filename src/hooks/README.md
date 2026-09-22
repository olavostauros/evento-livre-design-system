# Hooks

Shared React hooks.

- `useFieldControl.ts`  `FieldContext` and `useFieldControl(own)`: the bridge
  between the `Field` pattern and a form control. Merges the control's own
  `id`, `aria-describedby`, `aria-invalid` and `required` with the Field's;
  own values win, `aria-describedby` joins. Outside a Field, a no-op.

Planned: `useReducedMotion`, `useMediaQuery`.
