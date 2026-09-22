# Button

`src/components/primitives/Button/`. The action primitive. A native
`<button>` styled with role and density utilities, so one component serves
both registers and both themes.

## When to use

- Anything that performs an action on the current page: submit, confirm,
  open, close, retry, delete.
- One `primary` per view, at most. It is the thing the person came to do:
  "Comprar", "Confirmar", "Publicar evento".

## When not to use

- Navigation to another page: that is a link. A link that must look like a
  button is a later `LinkButton`, not a `Button` with an `onClick` that
  routes.
- Emphasis for its own sake. The accent colour never appears on a button;
  it is for highlights and data (colour.md).
- Toggles and selections: those are `Switch`, `Checkbox`, `Chip`, later.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary` `secondary` `ghost` `danger` | `secondary` | Primary is a choice, not a default |
| `size` | `sm` `md` `lg` | `md` | Maps to `control-sm/md/lg` density tokens |
| `fullWidth` | boolean | false | Sheet and form actions on B2C |
| `loading` | boolean | false | `aria-busy`, `aria-disabled`, clicks ignored, spinner replaces `iconStart`, label stays |
| `disabled` | boolean | | Native. Removed from the tab order; prefer `loading` for in-progress |
| `iconStart`, `iconEnd` | ReactNode | | Decorative, rendered `aria-hidden` |
| `type` | `button` `submit` `reset` | `button` | Never accidentally submits |
| `children` | ReactNode | required | The label. Text, always |

Everything else on `ButtonHTMLAttributes` passes through. `className` is
appended after the component's own classes.

## Sizes by register

Same class, different height. `md` is the default control height.

| Size | B2C | B2B |
|---|---|---|
| sm | 36px | 28px |
| md | 44px | 32px |
| lg | 52px | 40px |

B2C `md` is the 44px touch target. B2B `sm` at 28px is above the WCAG 2.5.8
minimum of 24px; do not go smaller.

## Variants

| Variant | Fill | Text | Border | Use |
|---|---|---|---|---|
| primary | `brand-solid`, hover `brand-700`, active `brand-800` | `fg-inverse` | none | The one action |
| secondary | `surface`, hover `surface-sunken` | `fg` | `border-strong`, active `fg` | Alternatives, default |
| ghost | transparent, hover `surface-sunken` | `fg-muted`, hover `fg` | none | Toolbars, inline, dense B2B rows |
| danger | `status-danger-solid`, hover `danger-700` | `fg-inverse` | none | Destructive, after a confirm |

All four carry AA text in both themes (see the contrast tables in
colour.md: 600 and 700 steps carry white; `fg` roles are AA on `surface`).

## Examples

```tsx
import { Button } from "@evento-livre/design-system/components/primitives/Button";

// B2C hero action, full width in a bottom sheet
<Button variant="primary" size="lg" fullWidth>
  Quero ir
</Button>

// B2B toolbar
<div data-register="b2b" className="flex gap-stack-sm">
  <Button variant="ghost" size="sm" iconStart={<FilterIcon />}>Filtrar</Button>
  <Button size="sm">Exportar</Button>
  <Button variant="primary" size="sm">Novo evento</Button>
</div>

// In progress: keeps focus and width, announces busy
<Button variant="primary" loading={isSaving} onClick={save}>
  Salvar
</Button>

// Destructive
<Button variant="danger" onClick={remove}>Excluir evento</Button>
```

## Accessibility

- Native `<button>`: keyboard (Enter, Space), focus and role for free.
- Focus is a 2px `ring` outline offset by 2px, visible on every fill in
  both themes (`ring` is 3:1 on canvas and surface).
- `loading` uses `aria-busy` and `aria-disabled` instead of `disabled`, so
  the button stays in the tab order and screen readers hear the state
  change. Clicks are swallowed while loading.
- `disabled` is native. It drops the button out of the tab order, which is
  right for "not applicable" and wrong for "in progress".
- Icons are decorative. An icon-only button must set `aria-label`; the
  label span is still required so the DOM has a text node.
- Motion is the `fast` duration at the register's tempo. At tempo 0 the
  state changes are instant and nothing is lost.

## Open

- The spinner is a placeholder arc. Loading is governed by
  `docs/brand/semiotics.md` ("the hand before the phone is raised") and the
  arc does not pass the four-question test. Replace it when the Icon
  primitive and the mark exist; the `data-slot="spinner"` hook and the
  `size-4` box stay.
- Icon sizing inside the slots is left to the coming `Icon` primitive.
- `LinkButton` (an anchor with button styling) and icon-only sizing are
  separate follow-ups.
