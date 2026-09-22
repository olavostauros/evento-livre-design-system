/**
 * Generates `src/styles/theme.css` from `src/tokens/index.ts` (decision 0005).
 *
 *   bun run build:theme          write the file
 *   bun run check:theme          exit 1 if the file is stale
 *
 * Output shape, in order:
 *   @theme { ... }            static values in Tailwind namespaces
 *   @theme inline { ... }     aliases that must resolve on the element
 *                             (theme roles, register values, tempo maths)
 *   @utility ...              text styles, elevation, durations
 *   :root / [data-theme]      light and dark role values
 *   [data-register]           accent, type scale, density, tempo per register
 *   @media reduced-motion     tempo 0
 *
 * One `emit*` function per token family. Keep the order stable so diffs
 * stay readable. Runtime custom properties are prefixed `--el-`.
 */

import {
  absolutes,
  animations,
  colorSteps,
  darkHairlineLevels,
  defaultRegister,
  density,
  densityKeys,
  distances,
  durations,
  easings,
  elevationLevels,
  elevationSurface,
  fontFamilies,
  fontWeights,
  palette,
  radii,
  radiusRoles,
  registerAccent,
  registers,
  resolveColor,
  roles,
  scaleEnter,
  shadows,
  spacingBase,
  statuses,
  tempos,
  textStyles,
  tracking,
  typeScale,
  typeSteps,
  type ColorRef,
  type ElevationLevel,
  type PaletteName,
  type Register,
  type ShadowLayer,
  type TextStyle,
  type Theme,
  type ThemeRoles,
} from "../src/tokens/index.ts";

const OUTPUT = new URL("../src/styles/theme.css", import.meta.url);
const P = "--el"; // runtime prefix

const kebab = (s: string): string => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const rem = (px: number): string => (px === 0 ? "0" : `${px / 16}rem`);
const line = (name: string, value: string): string => `  ${name}: ${value};`;
const indent = (lines: string[]): string[] => lines.map((l) => `  ${l}`);
const alphaHex = (alpha: number): string =>
  Math.round(alpha * 255).toString(16).padStart(2, "0").toUpperCase();
const tempo = (ms: number): string => `calc(${ms}ms * var(${P}-tempo))`;
const tempoPx = (px: number): string => `calc(${px}px * var(${P}-tempo))`;

/* ---------------------------------------------------------------- colour */

function flattenRoles(r: ThemeRoles): Array<[string, ColorRef]> {
  const out: Array<[string, ColorRef]> = [];
  for (const [key, value] of Object.entries(r)) {
    if (key === "status") continue;
    out.push([kebab(key), value as ColorRef]);
  }
  for (const status of statuses) {
    for (const [part, value] of Object.entries(r.status[status])) {
      out.push([`status-${status}-${part}`, value]);
    }
  }
  return out;
}

function emitColorPalette(): string[] {
  const out = ["  /* Colour: palette (0001). Tailwind defaults are cleared so only tokens exist. */"];
  out.push(line("--color-*", "initial"));
  for (const [name, value] of Object.entries(absolutes)) out.push(line(`--color-${name}`, value));
  for (const name of Object.keys(palette) as PaletteName[]) {
    for (const step of colorSteps) out.push(line(`--color-${kebab(name)}-${step}`, palette[name][step]));
  }
  return out;
}

function emitColorRoleAliases(): string[] {
  const out = ["  /* Colour: roles resolve at runtime by theme and register. */"];
  for (const [name] of flattenRoles(roles.light)) out.push(line(`--color-${name}`, `var(${P}-${name})`));
  for (const step of colorSteps) out.push(line(`--color-accent-${step}`, `var(${P}-accent-${step})`));
  return out;
}

function emitThemeColors(theme: Theme): string[] {
  return flattenRoles(roles[theme]).map(([name, ref]) => line(`${P}-${name}`, resolveColor(ref)));
}

function emitRegisterAccent(register: Register): string[] {
  const scale = kebab(registerAccent[register]);
  return colorSteps.map((step) => line(`${P}-accent-${step}`, `var(--color-${scale}-${step})`));
}

/* ------------------------------------------------------------ typography */

function emitTypographyStatic(): string[] {
  const out = ["  /* Typography: families, weights, tracking (0004). */"];
  out.push(line("--font-*", "initial"));
  for (const [name, stack] of Object.entries(fontFamilies)) out.push(line(`--font-${name}`, stack.join(", ")));
  out.push(line("--font-weight-*", "initial"));
  for (const [name, value] of Object.entries(fontWeights)) out.push(line(`--font-weight-${name}`, String(value)));
  out.push(line("--tracking-*", "initial"));
  for (const [name, value] of Object.entries(tracking)) out.push(line(`--tracking-${name}`, value === 0 ? "0" : `${value}em`));
  out.push(line("--text-*", "initial"));
  return out;
}

function emitTypographyAliases(): string[] {
  const out = ["  /* Typography: the size scale resolves per register. */"];
  for (const step of typeSteps) {
    out.push(line(`--text-${step}`, `var(${P}-text-${step})`));
    out.push(line(`--text-${step}--line-height`, `var(${P}-text-${step}--line-height)`));
  }
  return out;
}

function emitRegisterTypography(register: Register): string[] {
  const out: string[] = [];
  const display = register === "b2c" ? fontFamilies.display : fontFamilies.sans;
  out.push(line(`${P}-font-display`, display.join(", ")));
  for (const step of typeSteps) {
    const { size, lineHeight } = typeScale[register][step];
    out.push(line(`${P}-text-${step}`, rem(size)));
    out.push(line(`${P}-text-${step}--line-height`, rem(lineHeight)));
  }
  return out;
}

function emitTextStyleUtilities(): string[] {
  const out: string[] = ["/* Typography: named text styles. `type-body`, `type-heading`, ... */"];
  for (const [name, style] of Object.entries(textStyles) as Array<[string, TextStyle]>) {
    const family = style.displayOnB2cOnly ? `var(${P}-font-display)` : `var(--font-${style.family})`;
    const t = tracking[style.tracking];
    out.push(`@utility type-${name} {`);
    out.push(line("font-family", family));
    out.push(line("font-size", `var(${P}-text-${style.step})`));
    out.push(line("line-height", `var(${P}-text-${style.step}--line-height)`));
    out.push(line("font-weight", String(fontWeights[style.weight])));
    out.push(line("letter-spacing", t === 0 ? "0" : `${t}em`));
    if (style.tabular) out.push(line("font-variant-numeric", "tabular-nums lining-nums"));
    out.push("}");
  }
  return out;
}

/* --------------------------------------------------------- spacing, radii */

function emitSpacingStatic(): string[] {
  return ["  /* Spacing: 4px base (0006). */", line("--spacing", rem(spacingBase))];
}

function emitDensityAliases(): string[] {
  const out = ["  /* Spacing: density resolves per register. `p-inset-md`, `h-control-md`, `gap-stack-sm`. */"];
  for (const key of densityKeys) out.push(line(`--spacing-${key}`, `var(${P}-spacing-${key})`));
  return out;
}

function emitRegisterDensity(register: Register): string[] {
  return densityKeys.map((key) => line(`${P}-spacing-${key}`, rem(density[register][key])));
}

function emitRadiiStatic(): string[] {
  const out = ["  /* Radii: soft and rounded (0006). */", line("--radius-*", "initial")];
  for (const [name, px] of Object.entries(radii)) out.push(line(`--radius-${name}`, px >= 9999 ? "calc(infinity * 1px)" : rem(px)));
  return out;
}

function emitRadiusRoleAliases(): string[] {
  const out = ["  /* Radii: roles. `rounded-control`, `rounded-container`, ... */"];
  for (const [role, step] of Object.entries(radiusRoles)) out.push(line(`--radius-${role}`, `var(--radius-${step})`));
  return out;
}

/* ------------------------------------------------------------- elevation */

function shadowValue(theme: Theme, level: ElevationLevel): string {
  const ink = theme === "light" ? resolveColor(roles.light.fg) : absolutes.black;
  const layers = shadows[theme][level].map(
    (l: ShadowLayer) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${ink}${alphaHex(l.alpha)}`,
  );
  if (theme === "dark" && darkHairlineLevels.includes(level)) layers.unshift(`0 0 0 1px var(${P}-border)`);
  return layers.length ? layers.join(", ") : "none";
}

function emitElevationStatic(): string[] {
  return ["  /* Elevation (0006): shadows resolve per theme. */", line("--shadow-*", "initial")];
}

function emitShadowAliases(): string[] {
  return elevationLevels.map((level) => line(`--shadow-${level}`, `var(${P}-shadow-${level})`));
}

function emitThemeShadows(theme: Theme): string[] {
  return elevationLevels.map((level) => line(`${P}-shadow-${level}`, shadowValue(theme, level)));
}

function emitElevationUtilities(): string[] {
  const out = ["/* Elevation: surface plus shadow in one utility. `elevation-0` to `elevation-3`. */"];
  for (const level of elevationLevels) {
    out.push(`@utility elevation-${level} {`);
    out.push(line("background-color", `var(${P}-${kebab(elevationSurface[level])})`));
    out.push(line("box-shadow", `var(${P}-shadow-${level})`));
    out.push("}");
  }
  return out;
}

/* ---------------------------------------------------------------- motion */

function emitMotionStatic(): string[] {
  const out = ["  /* Motion (0003): easings are static; durations carry the register tempo. */"];
  out.push(line("--ease-*", "initial"));
  for (const [name, value] of Object.entries(easings)) out.push(line(`--ease-${name}`, value));
  out.push(line("--animate-*", "initial"));
  return out;
}

function emitMotionInline(): string[] {
  // Inline so the calc() lands on the element, where the nearest register's tempo applies.
  const out = ["  /* Motion: defaults and keyframe presets, tempo applied on the element. */"];
  out.push(line("--default-transition-duration", tempo(durations.base)));
  out.push(line("--default-transition-timing-function", "var(--ease-standard)"));
  for (const [name, preset] of Object.entries(animations)) {
    out.push(line(`--animate-${name}`, `${name} ${tempo(durations[preset.duration])} var(--ease-${preset.easing}) both`));
  }
  out.push("");
  out.push("  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }");
  out.push("  @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }");
  out.push(`  @keyframes slide-up { from { opacity: 0; transform: translateY(${tempoPx(distances.slide)}); } to { opacity: 1; transform: translateY(0); } }`);
  out.push(`  @keyframes scale-in { from { opacity: 0; transform: scale(calc(1 - (1 - ${scaleEnter}) * var(${P}-tempo))); } to { opacity: 1; transform: scale(1); } }`);
  return out;
}

function emitDurationUtilities(): string[] {
  const out = ["/* Motion: `duration-fast`, `duration-base`, ... multiplied by the register tempo. */"];
  for (const [name, ms] of Object.entries(durations)) {
    out.push(`@utility duration-${name} {`);
    out.push(line("--tw-duration", tempo(ms)));
    out.push(line("transition-duration", tempo(ms)));
    out.push("}");
  }
  return out;
}

function emitRegisterTempo(register: Register): string[] {
  return [line(`${P}-tempo`, String(tempos[register]))];
}

/* ---------------------------------------------------------------- render */

function registerSelector(register: Register): string {
  return register === defaultRegister
    ? `:root, [data-register="${register}"]`
    : `[data-register="${register}"]`;
}

function render(): string {
  const parts: string[] = [];
  parts.push("/* Generated by scripts/build-theme.ts from src/tokens/. Do not edit by hand. */", "");

  parts.push(
    "@theme {",
    ...emitColorPalette(), "",
    ...emitTypographyStatic(), "",
    ...emitSpacingStatic(), "",
    ...emitRadiiStatic(), "",
    ...emitElevationStatic(), "",
    ...emitMotionStatic(),
    "}", "",
  );

  parts.push(
    "@theme inline {",
    ...emitColorRoleAliases(), "",
    ...emitTypographyAliases(), "",
    ...emitDensityAliases(), "",
    ...emitRadiusRoleAliases(), "",
    ...emitShadowAliases(), "",
    ...emitMotionInline(),
    "}", "",
  );

  parts.push(...emitTextStyleUtilities(), "", ...emitElevationUtilities(), "", ...emitDurationUtilities(), "");

  parts.push("/* Theme: light is the default; dark follows the OS unless data-theme pins it. */");
  parts.push(':root, [data-theme="light"] {', ...emitThemeColors("light"), ...emitThemeShadows("light"), "}", "");
  parts.push("@media (prefers-color-scheme: dark) {");
  parts.push('  :root:not([data-theme="light"]) {', ...indent([...emitThemeColors("dark"), ...emitThemeShadows("dark")]), "  }");
  parts.push("}", "");
  parts.push('[data-theme="dark"] {', ...emitThemeColors("dark"), ...emitThemeShadows("dark"), "}", "");

  parts.push(`/* Register: accent, type scale, density and tempo follow the nearest data-register; ${defaultRegister} is the default. */`);
  for (const register of registers) {
    parts.push(
      `${registerSelector(register)} {`,
      ...emitRegisterAccent(register),
      ...emitRegisterTypography(register),
      ...emitRegisterDensity(register),
      ...emitRegisterTempo(register),
      "}", "",
    );
  }

  parts.push("/* Reduced motion is a third tempo: 0. Movement collapses, fades become instant. */");
  parts.push("@media (prefers-reduced-motion: reduce) {");
  parts.push(`  ${registers.map(registerSelector).join(", ")} {`, ...indent([line(`${P}-tempo`, String(tempos.reduced))]), "  }");
  parts.push("}");

  return `${parts.join("\n").trimEnd()}\n`;
}

const css = render();
const check = process.argv.includes("--check");
const current = await Bun.file(OUTPUT).text().catch(() => "");

if (check) {
  if (current === css) {
    console.log("theme.css is up to date");
  } else {
    console.error("theme.css is stale. Run `bun run build:theme` and commit the result.");
    process.exit(1);
  }
} else {
  await Bun.write(OUTPUT, css);
  console.log(`wrote ${OUTPUT.pathname}`);
}
