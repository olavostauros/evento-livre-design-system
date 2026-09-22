# Label

`src/components/primitives/Label/`. The caption of a form control. A
native `<label>` in the `label` text style.

## When to use

- Every `Input`, and later every Textarea, Select, Checkbox, Radio and
  Switch. A control without a label has no name.

## When not to use

- Text next to a value that is not a control ("Alcance: 12.400"). That is
  `Text variant="label"`.
- Placeholder text as the only label. Placeholders disappear on input.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `required` | boolean | false | Decorative marker; set `required` on the control too |
| `htmlFor` | string | | The control's `id`. Preferred over wrapping |
| `children` | ReactNode | required | |

Everything else on `LabelHTMLAttributes` passes through. `className` is
appended after the component's own classes.

## Examples

```tsx
import { useId } from "react";
import { Label } from "@evento-livre/design-system/components/primitives/Label";
import { Input } from "@evento-livre/design-system/components/primitives/Input";

// B2C: e-mail for event alerts
function AlertEmail() {
  const id = useId();
  return (
    <div className="flex flex-col gap-stack-sm">
      <Label htmlFor={id} required>E-mail</Label>
      <Input id={id} type="email" autoComplete="email" required />
    </div>
  );
}

// Wrapping instead of htmlFor, for a compact B2B filter
<Label data-register="b2b" className="flex items-center gap-stack-sm">
  Cidade
  <Input size="sm" name="city" />
</Label>
```

## Accessibility

- Native `<label>`: clicking focuses the control, and assistive tech reads
  the text as the control's name.
- The required marker is `aria-hidden`. Screen readers announce
  "required" from the control's `required` attribute, so always set both.
- `select-none` stops a double-click on the label from selecting its text
  instead of focusing the control.
- The `label` text style is `sm` at medium weight, 14px on B2C and 13px on
  B2B, both above the 12px floor.

## Open

- A `Field` pattern in `patterns/` that composes Label, a control, a
  description and an error message and wires `id`, `aria-describedby` and
  `aria-invalid`. Until then, wire them by hand as in the example.
