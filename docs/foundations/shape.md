# Shape: spacing, radii, elevation

Implements `docs/decisions/0006-shape.md` (soft and rounded). Values live in
`src/tokens/spacing.ts`, `radii.ts` and `elevation.ts`. Experimental as of
2026-09-22; pixel values may change without a new record.

## Spacing

Base unit 4px. Tailwind's numeric scale is the shared scale: `p-4` is 16px
in both registers and always will be. Density is a second, named set that
follows the nearest `data-register`:

| Token | Tailwind | B2C | B2B | Use |
|---|---|---|---|---|
| control-sm | `h-control-sm` | 36 | 28 | compact buttons, chips, table rows |
| control-md | `h-control-md` | 44 | 32 | default buttons and inputs |
| control-lg | `h-control-lg` | 52 | 40 | hero actions, sheet buttons |
| inset-sm | `p-inset-sm` | 12 | 8 | padding inside compact components |
| inset-md | `p-inset-md` | 16 | 12 | padding inside cards and inputs |
| inset-lg | `p-inset-lg` | 24 | 16 | padding inside sheets and dialogs |
| stack-sm | `gap-stack-sm` | 8 | 4 | gap between tightly related siblings |
| stack-md | `gap-stack-md` | 12 | 8 | gap between form fields, list items |
| stack-lg | `gap-stack-lg` | 16 | 12 | gap between groups |
| gutter | `px-gutter` | 16 | 24 | page side margin |

B2C `control-md` is 44px, the recommended touch target. B2B may go down
to 28px, above the 24px WCAG 2.5.8 minimum. The gutter is the one value
that grows on B2B: desktop pages breathe at the edges while the content
gets denser.

Components use density tokens for their own padding and height, and the
numeric scale for layout.

## Radii

| Step | px | Role | Tailwind |
|---|---|---|---|
| none | 0 | | `rounded-none` |
| xs | 4 | checkboxes, tags inside inputs | `rounded-xs` |
| sm | 8 | menu items, table cells with fills | `rounded-sm` |
| md | 12 | **control**: buttons, inputs, selects | `rounded-control` |
| lg | 16 | **container**: cards, panels, popovers | `rounded-container` |
| xl | 20 | **sheet**: bottom sheets, dialogs | `rounded-sheet` |
| 2xl | 28 | large hero surfaces | `rounded-2xl` |
| full | pill | **chip**: badges, chips, avatars, toggles | `rounded-chip` |

Use the role names. If the personality changes, only the role mapping in
`radii.ts` changes. Nested corners: inner radius = outer radius minus the
padding between them, never smaller than `xs`.

## Elevation

Four levels. Each pairs a surface role with a shadow, so `elevation-2`
sets both background and shadow. Use it instead of combining `bg-*` and
`shadow-*` by hand.

| Level | Surface role | Light shadow | Dark treatment | Use |
|---|---|---|---|---|
| 0 | canvas | none | none | page |
| 1 | surface | two soft layers, 1 to 3px | hairline, no shadow | cards, inputs, sheets |
| 2 | surface-raised | 4px and 16px layers | hairline and a deep 24px shadow | popovers, menus, toasts |
| 3 | surface-overlay | 16px and 48px layers | hairline and a deep 64px shadow | dialogs, over a scrim |

Light shadows are tinted with the foreground colour at 6 to 18 percent, so
they look like the warm neutral rather than grey. Dark surfaces separate by
tint (900, 800) and a hairline border; the shadow is there only to lift
overlays off the canvas. Dark surfaces stop at neutral-800 because subtle
text loses AA on anything lighter (see colour).
