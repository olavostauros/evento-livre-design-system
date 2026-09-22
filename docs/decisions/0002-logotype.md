# 0002. Logotype

- **Status:** accepted (temporary, revisit before first Usher release)
- **Date:** 2026-09-22
- **Deciders:** owner (accepted recommendation as temporary)

## Context

Evento Livre needs a logotype that works at favicon size on an attendee's phone
and at banner size on a producer's dashboard, on top of event artwork, in one
colour, and in both light and dark themes. It also has to coexist with Usher,
the product name, without confusing which is the company and which is the
product.

"Evento Livre" reads as "free event" or "open event" in Portuguese. "Livre"
carries the idea: open, unrestricted, free to move. That is the hook.

Constraints that apply to every option:

- Must reduce to a single-colour version with no loss of meaning.
- Must have a square or near-square mark for app icons and avatars.
- Must render in the chosen typeface (see 0004) or a custom-drawn derivative,
  so the wordmark and UI text feel related.
- SVG source, with clear-space and minimum-size rules documented.

A second, smaller question sits inside this one: **brand architecture.**
Is Usher "Usher by Evento Livre" (endorsed) or does Evento Livre stay in the
background (house of brands)? The options below assume **endorsed**: the
company mark appears, small, next to the product name. Flag if that is wrong.

## Options considered

### Option A. Wordmark only

"evento livre" set in lowercase in the brand typeface, with one custom
modification (for example the "v" in "livre" opened at the top, or the "e"
counters removed) that becomes the mark when cropped.

- Pros: cheapest. Wordmark and mark are the same drawing, so they never drift.
  Lowercase reads friendly to attendees, still clean for producers.
- Cons: weak at icon sizes unless the cropped letter is distinctive. Depends
  heavily on the typeface decision. Hard to own a single letter.

### Option B. Wordmark plus abstract mark

A separate geometric mark expressing "livre" as openness: an open ring, a
gate or doorway, a ticket stub with the perforation removed, or a bracket that
does not close. The mark sits left of the wordmark in the primary lockup and
stands alone for icons.

- Pros: strongest at small sizes. Mark can carry the brand on merchandise,
  wristbands, and badges where the wordmark is too long. Independent of the
  typeface.
- Cons: abstract marks take longer to earn recognition. Two drawings to
  maintain. Risk of resembling a generic "portal" or "location pin" icon.

### Option C. Monogram

"EL" drawn as a single ligature, the "L" forming an open corner that the "E"
sits inside. Wordmark appears beside it in lockups; monogram stands alone for
icons and as a pattern element.

- Pros: compact, ownable, works as a favicon at 16px. Naturally suggests an
  open space (the L's corner). Easy to animate (see 0003).
- Cons: monograms can feel corporate, which fights the B2C register. "EL" has
  no meaning to attendees until the wordmark teaches it.

## Recommendation

Option B. The mission is about a company that spans two audiences, and only a
mark independent of the wordmark can appear on a producer's invoice and an
attendee's wristband at the same weight. Explore three directions for the
mark: open ring, open bracket, open doorway. Pick after seeing all three at
16px, 48px and 512px on top of a busy event poster.

## Decision

Option B, wordmark plus mark, **accepted as temporary** on 2026-09-22.

**Amended 2026-09-22:** the mark's subject is fixed by
`docs/brand/semiotics.md`. It is not abstract. It is an index of the moment
of entry: the attendee's hand presenting their phone to be validated. The
employee, the scanner, the QR code and the gate are never shown. The earlier
exploration list (open ring, open bracket, open doorway) is withdrawn.
Explore instead three drawings of the hand-and-phone gesture, differing in
stroke weight and how much of the hand is shown, and compare at 16px, 48px
and 512px over a busy event poster before picking one.

Brand architecture assumed endorsed: "Usher by Evento Livre".

This is provisional. The mark direction and the endorsed assumption may both
change without a superseding record until the owner confirms. Keep the `Logo`
component's API stable so the artwork can be swapped freely.

## Consequences

Now unblocked: SVG sources in `src/brand/logotype/`, a `Logo` component
in `src/components/primitives/`, clear-space and misuse rules in
`docs/brand/logotype.md`, and a decision on the Usher lockup.
