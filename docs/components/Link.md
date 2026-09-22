# Link

`src/components/primitives/Link/`. The navigation primitive. A native
`<a>` in the `link` colour role, underlined by default, with first-class
support for external hand-offs.

## When to use

- Going somewhere: another page, a section, a seller's site.
- The hand-off. On B2C, "Ver ingressos" leaves Usher for the site that
  sells the ticket. That is a link, external, and it says so.

## When not to use

- Doing something on the current page: that is `Button`. An `<a>` without
  an `href` or with `onClick` that does not navigate is wrong.
- A link that must look like a button (a full-width hand-off in a sheet).
  That is a later `LinkButton` that reuses Button's classes; do not pass
  Button classes into `Link`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | string | required | |
| `tone` | `link` `inherit` | `link` | `inherit` takes the surrounding text colour |
| `underline` | `always` `hover` | `always` | `hover` for nav lists and cards |
| `external` | boolean | false | `target="_blank"`, `rel="noopener noreferrer"`, hidden note |
| `externalLabel` | string | `(abre em nova aba)` | The hidden note; override per language |
| `children` | ReactNode | required | |

Everything else on `AnchorHTMLAttributes` passes through. Explicit `target`
and `rel` win over the `external` defaults. `className` is appended after
the component's own classes.

## Tones and underline

| Tone | Colour | Guarantee (colour.md) |
|---|---|---|
| `link` | `link` role (brand-700 light, brand-300 dark) | AA on canvas and surface |
| `inherit` | `currentColor` | Whatever the surrounding text guarantees |

| Underline | Rest | Hover | Use |
|---|---|---|---|
| `always` | 1px, offset 2px | 2px | Inline in running text, where colour alone would not mark it |
| `hover` | none | 1px | Nav lists, footers, cards, where the layout already says "links" |

`inherit` with `hover` is the navigation combination. `link` with `always`
is the body-copy combination and the default.

## Examples

```tsx
import { Link } from "@evento-livre/design-system/components/primitives/Link";

// B2C hand-off to the seller, inside an event card
<Link href={event.ticketUrl} external>Ver ingressos</Link>

// Inline in running text
<Text variant="body-sm" tone="muted">
  Não encontrou o evento? <Link href="/alertas">Crie um alerta</Link>.
</Text>

// B2B: a row in a campaign report that opens the campaign
<td data-register="b2b">
  <Link href={`/campanhas/${campaign.id}`} tone="inherit" underline="hover">
    {campaign.name}
  </Link>
</td>

// Navigation
<nav aria-label="Principal">
  <Link href="/eventos" tone="inherit" underline="hover" aria-current="page">Eventos</Link>
  <Link href="/alertas" tone="inherit" underline="hover">Alertas</Link>
</nav>
```

## Accessibility

- Native `<a href>`: keyboard, focus, role and the context menu for free.
- `external` appends a visually hidden "(abre em nova aba)" so screen
  reader users know the context will change, and sets a safe `rel`.
- Focus is the 2px `ring` outline offset by 2px, on a 4px radius so it
  hugs inline text.
- `always` underline keeps links distinguishable from text without
  relying on colour (WCAG 1.4.1). Use `hover` only where the surrounding
  layout carries that distinction.
- `link` role text is AA on canvas and surface in both themes. On any
  other surface use `inherit` inside a `Text` tone that is AA there.

## Open

- `LinkButton`: an anchor with Button's variants and sizes, for the
  full-width hand-off in a B2C sheet.
- An external-link glyph in the `Icon` set, once the set exists. The hidden
  note stays either way.
