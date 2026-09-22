# 0004. Typography

- **Status:** accepted (temporary, revisit before first Usher release)
- **Date:** 2026-09-22
- **Deciders:** owner (accepted recommendation as temporary)

## Context

Type does most of the work in both registers. Producers read tables, forms
and numbers for hours. Attendees read an event name, a date, a price and a
seat in a glance, often on a small phone in bad light. The wordmark (0002)
will be set in or derived from the chosen face.

Constraints that apply to every option:

- Full Latin coverage including Portuguese diacritics (ã, õ, ç, é, ê, á, à).
- Tabular figures for B2B tables and prices. Lining figures by default.
- Variable font preferred, one file per family, self-hosted. No Google Fonts
  runtime dependency.
- Open licence (OFL or equivalent) unless the owner budgets for a licence.
- Readable at 14px on a phone and 12px in a dense table.

## Options considered

### Option A. One workhorse sans

A single variable sans-serif for everything, with weight and size doing all
the differentiation. Candidates: Inter (ubiquitous, excellent UI hinting),
Geist (tighter, more contemporary), Manrope (rounder, friendlier).

- Pros: one file, one set of rules, no pairing mistakes. Fast to ship. All
  three candidates have tabular figures and full diacritics.
- Cons: Inter is everywhere and reads as "default app". Little personality
  for B2C headlines or the wordmark. Brand recognition must come from colour
  and mark alone.

### Option B. Display face plus workhorse sans

A characterful display face for B2C headlines, event names, and the wordmark,
paired with a workhorse sans (from Option A) for all UI and all of B2B.
Display candidates: Bricolage Grotesque (warm, slightly odd), Unbounded
(wide, loud, festival energy), Syne (editorial, geometric).

- Pros: gives B2C and the brand a voice. Producer screens stay calm because
  they never see the display face. Wordmark and B2C headlines feel related.
- Cons: two files, pairing rules to document, and a sharp line to hold about
  where the display face is allowed. Loud display faces date quickly.

### Option C. Custom or licensed brand face

Commission or license a proprietary face for the wordmark and headlines,
with a workhorse sans underneath.

- Pros: fully ownable. Nobody else in the market has it.
- Cons: cost, time, licensing overhead for every product and partner. Not
  justified with one product and no established brand yet.

## Recommendation

Option B, with Geist or Manrope as the workhorse and Bricolage Grotesque as
the display face. Bricolage has the warmth for "livre" without shouting, and
it is distinctive enough to derive a wordmark from. Test the pairing on one
event card and one data table before committing. Revisit Option C only after
the brand has proven itself in market.

## Decision

Option B, display face plus workhorse sans, **accepted as temporary** on
2026-09-22. Workhorse: Geist or Manrope (pick after testing a data table).
Display: Bricolage Grotesque, used only for B2C headlines, event names and the
wordmark. Test the pairing on one event card and one data table first.

**Amended 2026-09-22:** workhorse is **Geist** (variable, OFL, self-hosted).
Manrope is withdrawn. The data-table test still happens, as the first B2B
pattern, and its result goes in `docs/foundations/typography.md`.

This is provisional. Either face may be swapped without a superseding record
until the wordmark is drawn, after which changing the display face requires a
new decision record.

## Consequences

Now unblocked: font files under `src/styles/fonts/`, `@font-face` rules
in `src/styles/`, `src/tokens/typography.ts` with a type scale for each
register, and `docs/foundations/typography.md`.
