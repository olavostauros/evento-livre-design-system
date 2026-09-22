# Input

`src/components/primitives/Input/`. The single-line text field. A native
`<input>` for text-like types, styled with role and density utilities, so
one component serves both registers and both themes.

## When to use

- Free text, one line: e-mail, name, city, search, a URL, a number, a
  date.

## When not to use

- Several lines: a later `Textarea`.
- A choice among options: `Select`, `Checkbox`, `Radio`, `Switch`, later.
- Without a `Label`. A field with only a placeholder has no name once
  someone types. In a form row, use `Field`, which wires the label,
  description and error for you.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `text` `email` `password` `search` `tel` `url` `number` `date` `time` `datetime-local` | `text` | Text-like types only |
| `size` | `sm` `md` `lg` | `md` | Maps to `control-sm/md/lg` density tokens |
| `invalid` | boolean | | `aria-invalid="true"` and a danger border; add a visible message. Inherits from `Field` when unset; `false` overrides |
| `disabled` | boolean | | Native. Out of the tab order, half opacity |
| `readOnly` | boolean | | Native. Sunken background, still focusable and selectable |
| `required` | boolean | | Native. Pair with `Label required` |

Everything else on `InputHTMLAttributes` passes through, except the HTML
`size` attribute (width in characters), which the prop name shadows;
constrain width with `className` or the layout instead. The field is
always `block w-full`. `className` is appended after the component's own
classes.

Inside a `Field`, the input reads `id`, `aria-describedby`, `aria-invalid`
and `required` from `FieldContext` (`src/hooks/useFieldControl.ts`).
Explicit props win; an explicit `aria-describedby` is kept and the Field's
ids are appended. Outside a Field nothing changes.

## Sizes by register

Same class, different height. `md` is the default control height.

| Size | B2C height / text | B2B height / text | Use |
|---|---|---|---|
| sm | 36px / 14px | 28px / 13px | Dense B2B toolbars and table filters |
| md | 44px / 16px | 32px / 14px | Forms, the default |
| lg | 52px / 16px | 40px / 14px | Hero search on B2C |

`md` and `lg` use `text-base`, which is 16px on B2C. iOS Safari zooms the
whole page into a focused field whose font is under 16px, which is exactly
the moment an attendee is typing on a phone. `sm` is `text-sm` (14px on
B2C) and is not for phone forms.

## States

| State | How | Look |
|---|---|---|
| Rest | | `surface` fill, `border-strong` border (3:1), `fg-subtle` placeholder |
| Focus | `:focus` | 2px `ring` outline, offset 2px. Shown on every focus, not only keyboard |
| Invalid | `invalid` | Border in `status-danger-fg`, which is AA on canvas and surface in both themes, so the boundary keeps 3:1. `status-danger-border` would not |
| Disabled | `disabled` | Half opacity, not-allowed cursor |
| Read only | `readOnly` | `surface-sunken` fill |

Border, placeholder and text roles come straight from
`docs/foundations/colour.md`. Motion is `fast` at the register's tempo.

## Examples

```tsx
import { Field } from "@evento-livre/design-system/components/patterns/Field";
import { Input } from "@evento-livre/design-system/components/primitives/Input";
import { Label } from "@evento-livre/design-system/components/primitives/Label";

// B2C: e-mail for event alerts, with a visible error. Field wires the
// label, the error and aria-invalid; Input only says what it is.
function AlertEmail({ error }: { error?: string }) {
  return (
    <Field label="E-mail" error={error} required>
      <Input type="email" autoComplete="email" inputMode="email" />
    </Field>
  );
}

// B2B: a search filter in a report toolbar
<div data-register="b2b" className="flex items-center gap-stack-sm">
  <Label htmlFor="q" className="sr-only">Buscar campanha</Label>
  <Input id="q" type="search" size="sm" placeholder="Buscar campanha" className="max-w-xs" />
</div>
```

## Accessibility

- Native `<input>`: keyboard, focus, autofill and the platform's own
  pickers for `date`, `time` and `number`.
- Always a `Label`, by `htmlFor` or by wrapping. A visually hidden label
  (`sr-only`) is still a label.
- `invalid` only sets `aria-invalid` and the border. Put the message in
  the DOM and point `aria-describedby` at it, so the reason is read out
  and colour is never the only signal. `Field` does this for you.
- The focus ring shows on every focus, not only `:focus-visible`, because
  a text field is always being operated when it has focus.
- `border-strong` is 3:1 on canvas and surface in both themes (WCAG
  1.4.11). Do not lower it with `className`.
- Set `inputMode` and `autoComplete` on phone forms; they pick the right
  keyboard and fill the field for the person.

## Open

- Start and end adornments (a search glyph, a clear button, a unit): an
  `InputGroup` pattern that wraps the input in the bordered box.
- `Textarea` and `Select` share these classes and the `useFieldControl`
  opt-in; extract a shared control class set when the second one lands.
