# Field

`src/components/patterns/Field/`. One labelled form control with an
optional description and error. Composes `Label`, `Text` and the control
passed as children, and does the wiring the primitives leave to the
caller: a shared id, the label's `for`, `aria-describedby`, `aria-invalid`
and `required`.

The first pattern. Patterns compose primitives and own the wiring between
them; they add no visual language of their own.

## When to use

- Every single-control form row: an `Input` with its name, a hint and a
  validation message.

## When not to use

- A group of related controls under one caption (radios, checkboxes, a
  date range). That is a later `Fieldset`.
- A control that carries its own visible label, such as a later `Switch`
  or `Checkbox` with inline text.
- Layouts where the label sits beside the control (a compact B2B filter
  bar). Use `Label` and `Input` directly, as in the Label doc.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | ReactNode | required | Rendered as `Label` pointing at the control |
| `description` | ReactNode | | Hint above the control, `body-sm` muted |
| `error` | ReactNode | | Message below the control, `body-sm` danger. Also marks the control invalid |
| `required` | boolean | false | Marker on the label and `required` on the control |
| `id` | string | `useId()` | Base for the generated ids: `{id}-control`, `-description`, `-error` |
| `children` | ReactNode | required | One control that reads `FieldContext` |

Everything else on `HTMLAttributes<HTMLDivElement>` passes through to the
root `<div>`. `className` is appended after the component's own classes.
The root sets `data-invalid` when there is an error.

## How the control is wired

Field does not clone or inspect its children. It provides `FieldContext`
(`src/hooks/useFieldControl.ts`) with the control's `id`,
`aria-describedby`, `aria-invalid` and `required`. A control calls
`useFieldControl(ownProps)` and spreads the result. `Input` does this
already; `Textarea`, `Select` and the rest opt in the same way when they
land.

Explicit props on the control win over the Field's, key by key. The one
exception is `aria-describedby`: the control's own ids are kept and the
Field's are appended, so a product can point at an extra hint without
losing the description and error.

## DOM order

```
<div class="flex flex-col gap-stack-sm">
  <label for="f-control">…</label>
  <p id="f-description">…</p>          description, if any
  <input id="f-control" aria-describedby="f-description f-error" …>
  <p id="f-error">…</p>                error, if any
</div>
```

The description sits above the control so it is read before typing. The
error sits below, where the eye lands after typing. `aria-describedby`
lists them in that order so the reason is read after the hint. The gap is
`stack-sm`, 8px on B2C and 4px on B2B.

## Examples

```tsx
import { Field } from "@evento-livre/design-system/components/patterns/Field";
import { Input } from "@evento-livre/design-system/components/primitives/Input";

// B2C: e-mail for event alerts, with a hint and a validation message
function AlertEmail({ error }: { error?: string }) {
  return (
    <Field
      label="E-mail"
      description="Só para avisar quando um evento combinar com você."
      error={error}
      required
    >
      <Input type="email" autoComplete="email" inputMode="email" />
    </Field>
  );
}

// B2B: a campaign name in a settings form, no hint
<form data-register="b2b" className="flex flex-col gap-stack-lg">
  <Field label="Nome da campanha" error={errors.name}>
    <Input name="name" defaultValue={campaign.name} />
  </Field>
  <Field label="Cidade" description="Onde os leads devem estar.">
    <Input name="city" autoComplete="address-level2" />
  </Field>
</form>
```

## Accessibility

- The label is a real `<label for>`: clicking focuses the control and the
  control's accessible name is the label text.
- `required` sets both the decorative marker and the control's native
  `required`, so "required" is announced once, from the attribute.
- The error is in the DOM and referenced by `aria-describedby`, so it is
  read with the control and colour is never the only signal (WCAG 3.3.1).
- Field does not announce errors as they appear. On submit, the form
  should move focus to the first invalid control; its description is then
  read. Inline live announcements are an open item below.
- `text-fg-muted` and `text-status-danger-fg` are AA on canvas and surface
  in both themes (colour.md), and `body-sm` is above the 12px floor in
  both registers.

## Open

- A live region for errors that appear on blur without a focus move.
- `Fieldset`: one caption, one description and one error for a group of
  controls, wired through `aria-labelledby` and `aria-describedby`.
- Passing `disabled` through the context, once a second control exists to
  prove the shape.
