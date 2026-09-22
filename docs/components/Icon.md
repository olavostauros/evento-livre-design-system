# Icon

`src/components/primitives/Icon/`. The glyph container. It renders the
`<svg>` on the shared 24px grid with the shared stroke weight, and takes
path nodes as children. It ships no glyphs.

## Why there are no glyphs yet

Every non-verbal sign follows `docs/brand/semiotics.md`: icons must share
the mark's stroke weight, corner logic and warmth. The mark is not drawn
(0002), so the icon set cannot be. What is fixed now, in
`src/tokens/icons.ts`, is everything a glyph does not decide: the grid,
the stroke width, the rendered sizes. When the set arrives, each glyph is
a small component that returns `<Icon {...props}><path … /></Icon>`.

Until then products may draw their own paths on a 24px grid. Anything
that stands for "ticket", "entry", "check-in" or "validated" must pass
the four-question test in the semiotics doc before it ships.

## When to use

- A glyph next to a label (Button `iconStart`, a Link, a list item).
- A glyph that stands alone and means something, with `label`.

## When not to use

- Illustration, logos, the mark. Those are brand assets with their own
  components.
- Images of content (event artwork). That is an `<img>`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `sm` `md` `lg` | `md` | 16, 20, 24px; from `iconSizes` |
| `label` | string | | Accessible name. Turns the icon into `role="img"` |
| `children` | ReactNode | required | Path nodes on the 24px grid |

Everything else on `SVGAttributes` passes through except `viewBox`,
`width`, `height`, `role`, `aria-hidden` and `aria-label`, which the
component owns. `className` is appended after the component's own classes.

Fixed attributes: `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="currentColor"`, `stroke-width` from `iconStrokeWidth`,
round caps and joins (0006: soft corners at every scale).

## Sizes

| Size | px | Pairs with |
|---|---|---|
| sm | 16 | `text-sm`, Button `sm`, table cells, badges |
| md | 20 | `text-base`, Button `md`, list items |
| lg | 24 | Standalone, toolbars, empty states |

Sizes do not change by register. Text does, so at B2B `sm` (13px) a `sm`
icon reads slightly larger than the type next to it, which is the
intended floor: nothing drawn goes under 16px (semiotics).

## Examples

```tsx
import { Icon, type IconProps } from "@evento-livre/design-system/components/primitives/Icon";
import { Button } from "@evento-livre/design-system/components/primitives/Button";

// A product-local glyph on the 24px grid
function FilterGlyph(props: Omit<IconProps, "children">) {
  return (
    <Icon {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Icon>
  );
}

// Decorative, next to a label (Button hides the slot from assistive tech)
<Button variant="ghost" size="sm" iconStart={<FilterGlyph size="sm" />}>
  Filtrar
</Button>

// Meaningful on its own: give it a name
<Icon label="Alerta ativo" className="text-brand-fg">
  <path d="M12 4v12M12 19v1" />
</Icon>

// Takes the tone of the text around it
<Text variant="body-sm" tone="muted">
  <Icon size="sm"><path d="M12 8v4l3 3" /></Icon> Amanhã, 21h
</Text>
```

## Accessibility

- Decorative by default: `aria-hidden="true"`, no role. Most icons sit
  next to a label and should stay that way.
- With `label` the icon is `role="img"` with that name. Use it only when
  nothing else on the page says what the icon means.
- Never make an icon the only signal for status. Pair it with text.
- Colour comes from `currentColor`, so contrast is the surrounding text's
  contrast. Put icons in `fg`, `fg-muted`, `brand-fg` or a `status-*-fg`
  role, never on steps 400 or 500 (colour.md).

## Open

- The glyph set, blocked on the mark (0002, semiotics).
- `iconStrokeWidth` is provisional until the mark fixes the weight.
- Button's placeholder spinner becomes an `Icon`-based drawn loader once
  the set exists ("the hand before the phone is raised").
