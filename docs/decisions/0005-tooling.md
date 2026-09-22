# 0005. Tooling: Bun and Tailwind CSS v4

- **Status:** accepted
- **Date:** 2026-09-22
- **Deciders:** owner, agent

## Context

`CLAUDE.md` leaves the package manager, bundler, test runner and docs tool
unchosen and requires a record before any is added. Tokens exist as
TypeScript in `src/tokens/` and must feed Tailwind, not the other way round.
Nothing can be installed, type-checked or tested until this is decided.

Tailwind v3 reads a JavaScript config (`tailwind.config.ts`). Tailwind v4
reads its theme from CSS (`@theme { --color-brand-500: ... }`) and treats a
JavaScript config as a legacy path behind `@config`. The two versions imply
different shapes for the token-to-Tailwind bridge.

## Options considered

1. **Bun + Tailwind v3.** Keep `tailwind.config.ts` importing from
   `src/tokens/`. Pros: matches the layout `CLAUDE.md` already describes.
   Cons: v3 is in maintenance; new work would start on an old major.
2. **Bun + Tailwind v4, tokens generated into CSS.** Tokens stay the single
   source of truth in TypeScript. A Bun script emits `src/styles/theme.css`
   containing a `@theme` block, which `src/styles/index.css` imports. Pros:
   idiomatic v4, tokens remain typed and importable by components and tests,
   generated CSS can be committed and diffed. Cons: one generator script to
   maintain, and a stale-output check is needed in CI.
3. **Bun + Tailwind v4, tokens authored in CSS.** `@theme` is the source and
   TypeScript reads it. Pros: no generator. Cons: reverses the rule in
   `CLAUDE.md`; tokens stop being typed values components can import.

## Decision

Option 2.

- **Bun** is the package manager, script runner, bundler (`bun build`) and
  test runner (`bun test`). Lockfile is committed.
- **Tailwind CSS v4.** There is no `tailwind.config.ts`. The theme is
  generated: `scripts/build-theme.ts` reads `src/tokens/index.ts` and writes
  `src/styles/theme.css` with a `@theme` block. Both the script output and
  the source are committed; a `bun run check:theme` step fails if the
  generated file is out of date.
- Token names map to Tailwind namespaces: `--color-*`, `--font-*`,
  `--text-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--ease-*`,
  `--animate-*`. Register-specific values (B2B/B2C tempo, accent) are exposed
  as CSS custom properties switched by a `data-register` attribute on an
  ancestor, so components stay register-agnostic.
- **TypeScript** strict mode, checked with `bunx tsc --noEmit`.
- Docs tool remains unchosen. Component docs stay Markdown in
  `docs/components/` until a record picks one.

## Consequences

Unblocks `package.json`, `tsconfig.json`, `src/tokens/*.ts`,
`scripts/build-theme.ts`, `src/styles/index.css` and `src/styles/theme.css`.
`CLAUDE.md` layout and stack sections are updated to match. Any further
dependency (a headless UI library, a physics motion library, a docs tool)
still needs its own record.
