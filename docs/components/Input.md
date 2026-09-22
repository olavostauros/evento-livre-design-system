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
  someone types.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `text` `email` `password` `search` `tel` `url` `number` `date` `time` `datetime-local` | `text` | Text-like types only |
| `size` | `sm` `md` `lg` | `md` | Maps to `control-sm/md/lg` density tokens |
| `invalid` | boolean | false | `aria-invalid="true"` and a danger border; add a visible message |
| `disabled` | boolean | | Native. Out of the tab order, half opacity |
| `readOnly` | boolean | | Native. Sunken background, still focusable and selectable |
| `required` | boolean | | Native. Pair with `Label required` |

Everything else on `InputHTMLAttributes` passes through, except the HTML
`size` attribute (width in characters), which the prop name shadows;
constrain width with `className` or the layout instead. The field is
always `block w-full`. `className` is appended after the component's own
classes.

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
import { useId } from "react";
import { Input } from "@evento-livre/design-system/components/primitives/Input";
import { Label } from "@evento-livre/design-system/components/primitives/Label";
import { Text } from "@evento-livre/design-system/components/primitives/Text";

// B2C: e-mail for event alerts, with a visible error
function AlertEmail({ error }: { error?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-stack-sm">
      <Label htmlFor={id} required>E-mail</Label>
      <Input
        id={id}
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <Text id={errorId} variant="body-sm" tone="danger">
          {error}
        </Text>
      )}
    </div>
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
  and colour is never the only signal.
- The focus ring shows on every focus, not only `:focus-visible`, because
  a text field is always being operated when it has focus.
- `border-strong` is 3:1 on canvas and surface in both themes (WCAG
  1.4.11). Do not lower it with `className`.
- Set `inputMode` and `autoComplete` on phone forms; they pick the right
  keyboard and fill the field for the person.

## Open

- Start and end adornments (a search glyph, a clear button, a unit): an
  `InputGroup` pattern that wraps the input in the bordered box.
- `Textarea` and `Select` share these classes; extract a shared control
  class set when the second one lands.
- A `Field` pattern that wires label, description and error.
