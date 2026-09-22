# Text

`src/components/primitives/Text/`. The typography primitive. Sets one named
text style from the tokens and one foreground role, so every run of text
follows the register's type scale and the theme's colours without knowing
either.

## When to use

- Any text that is not inside a control: headings, body copy, captions,
  labels next to data, prices, counts, codes.
- When the element matters for the document outline. Pick the level with
  `as`; the style and the level are separate decisions.

## When not to use

- Inside `Button`, `Link` or `Label`: they set their own text style.
- For a run of text that only needs a class. `type-body` and `text-fg-muted`
  are plain utilities; `Text` exists so the pairing and the element are
  explicit and the variant is typed.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | a text style name (below) | `body` | Derived from `src/tokens/typography.ts` |
| `as` | `p` `span` `div` `h1`..`h6` `label` `code` `strong` `em` `small` `figcaption` `legend` | per variant | Heading level is the caller's call |
| `tone` | `default` `muted` `subtle` `inverse` `brand` `success` `warning` `danger` `info` | `default` | Foreground role |
| `align` | `start` `center` `end` | inherit | |
| `truncate` | boolean | false | One line, ellipsis; needs a bounded width |
| `children` | ReactNode | required | |

Everything else on `HTMLAttributes` passes through. `className` is appended
after the component's own classes.

## Variants

| Variant | Utility | Default element | Use |
|---|---|---|---|
| `display-xl` | `type-display-xl` | `h1` | One line. B2C hero, event name on a detail page |
| `display-lg` | `type-display-lg` | `h1` | Page title on B2C |
| `title` | `type-title` | `h2` | Event name on a card, section title on B2C |
| `heading` | `type-heading` | `h2` | Page and panel headings, both registers |
| `subheading` | `type-subheading` | `h3` | Card and group headings |
| `body` | `type-body` | `p` | Running text |
| `body-sm` | `type-body-sm` | `p` | Secondary text, table cells |
| `label` | `type-label` | `span` | Text next to a value or a control |
| `caption` | `type-caption` | `span` | Timestamps, footnotes |
| `overline` | `type-overline` + `uppercase` | `span` | Section eyebrow; the component uppercases it |
| `numeric` | `type-numeric` | `span` | Prices, counts, anything in a column: tabular lining figures |
| `code` | `type-code` | `code` | IDs, codes |

Display styles use the display face on B2C and the sans on B2B; the
component does nothing special, the utility resolves per register
(`docs/foundations/typography.md`).

## Tones

| Tone | Role | Guarantee (colour.md) |
|---|---|---|
| `default` | `fg` | AA on every surface |
| `muted` | `fg-muted` | AA on every surface |
| `subtle` | `fg-subtle` | AA on canvas and surface |
| `inverse` | `fg-inverse` | AA on `brand-solid` and every status solid |
| `brand` | `brand-fg` | AA on canvas, surface and `brand-bg` |
| `success` `warning` `danger` `info` | `status-*-fg` | AA on `status-*-bg`, canvas and surface |

## Examples

```tsx
import { Text } from "@evento-livre/design-system/components/primitives/Text";

// B2C event card
<article>
  <Text variant="overline" tone="muted">Sexta, 3 de outubro</Text>
  <Text variant="title" as="h3" truncate>Baile da Santa</Text>
  <Text variant="body-sm" tone="muted">Circo Voador, Lapa</Text>
  <Text variant="numeric">a partir de R$ 60</Text>
</article>

// B2B report header
<header data-register="b2b">
  <Text variant="overline" tone="subtle">Campanha</Text>
  <Text variant="heading" as="h1">Alcance por canal</Text>
  <Text variant="caption" tone="muted">Atualizado há 5 minutos</Text>
</header>

// Status text, always with words
<Text variant="body-sm" tone="danger">Endereço de e-mail inválido.</Text>
```

## Accessibility

- The element carries the semantics. Use `as` to set heading levels in
  document order; do not skip levels to get a smaller style, change
  `variant` instead.
- Every tone is AA on the surfaces the table above names. Do not put
  `subtle` on `surface-sunken` or `inverse` on anything but a solid fill.
- Tone is never the only signal. A `danger` sentence says what is wrong.
- `truncate` hides text. Give the full text in a `title` attribute or make
  sure it is available elsewhere on the page.

## Open

- `overline` is uppercased with CSS, which screen readers handle fine; if a
  product needs the source text uppercased for copy-paste, do it in copy.
- A `balance` option for display headings (`text-wrap: balance`) can be
  added once a B2C hero exists to test it on.
