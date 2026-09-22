import { describe, expect, test } from "bun:test";
import { AA, contrastRatio } from "../utils/color.ts";
import {
  absolutes,
  colorSteps,
  palette,
  resolveColor,
  roles,
  statuses,
  themes,
  type ColorRef,
  type PaletteName,
} from "./colors.ts";

const chromatic = (Object.keys(palette) as PaletteName[]).filter((n) => n !== "neutral");
const hex = (c: ColorRef) => resolveColor(c);

describe("palette", () => {
  test("every scale has every step as a 6-digit hex", () => {
    for (const name of Object.keys(palette) as PaletteName[]) {
      for (const step of colorSteps) {
        expect(palette[name][step]).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });

  test("lightness ramps are monotonic (50 lightest, 950 darkest)", () => {
    for (const name of Object.keys(palette) as PaletteName[]) {
      let previous = Number.POSITIVE_INFINITY;
      for (const step of colorSteps) {
        const onBlack = contrastRatio(palette[name][step], absolutes.black);
        expect(onBlack).toBeLessThan(previous);
        previous = onBlack;
      }
    }
  });

  test("600 carries white text at AA and 500 meets AA for UI, on every chromatic scale", () => {
    for (const name of chromatic) {
      expect(contrastRatio(palette[name][600], absolutes.white)).toBeGreaterThanOrEqual(AA.text);
      expect(contrastRatio(palette[name][500], absolutes.white)).toBeGreaterThanOrEqual(AA.large);
    }
  });

  test("400 carries text at AA on the dark canvas, on every chromatic scale", () => {
    const canvas = hex(roles.dark.canvas);
    for (const name of chromatic) {
      expect(contrastRatio(palette[name][400], canvas)).toBeGreaterThanOrEqual(AA.text);
    }
  });

  test("success is not the brand (0001 amendment)", () => {
    for (const step of colorSteps) {
      expect(palette.success[step]).not.toBe(palette.brand[step]);
    }
  });
});

describe("roles", () => {
  for (const theme of themes) {
    const r = roles[theme];
    const surfaces = [r.canvas, r.surface, r.surfaceRaised, r.surfaceOverlay, r.surfaceSunken].map(hex);

    test(`${theme}: text and fgMuted are AA on every surface`, () => {
      for (const s of surfaces) {
        expect(contrastRatio(hex(r.fg), s)).toBeGreaterThanOrEqual(AA.text);
        expect(contrastRatio(hex(r.fgMuted), s)).toBeGreaterThanOrEqual(AA.text);
      }
    });

    test(`${theme}: fgSubtle, link and brandFg are AA on canvas and surface`, () => {
      for (const s of [hex(r.canvas), hex(r.surface)]) {
        expect(contrastRatio(hex(r.fgSubtle), s)).toBeGreaterThanOrEqual(AA.text);
        expect(contrastRatio(hex(r.link), s)).toBeGreaterThanOrEqual(AA.text);
        expect(contrastRatio(hex(r.brandFg), s)).toBeGreaterThanOrEqual(AA.text);
      }
    });

    test(`${theme}: ring and borderStrong meet 3:1 on canvas and surface`, () => {
      for (const s of [hex(r.canvas), hex(r.surface)]) {
        expect(contrastRatio(hex(r.ring), s)).toBeGreaterThanOrEqual(AA.large);
        expect(contrastRatio(hex(r.borderStrong), s)).toBeGreaterThanOrEqual(AA.large);
      }
    });

    test(`${theme}: fgInverse is AA on brandSolid and every status solid`, () => {
      expect(contrastRatio(hex(r.fgInverse), hex(r.brandSolid))).toBeGreaterThanOrEqual(AA.text);
      for (const status of statuses) {
        expect(contrastRatio(hex(r.fgInverse), hex(r.status[status].solid))).toBeGreaterThanOrEqual(AA.text);
      }
    });

    test(`${theme}: status fg is AA on its bg, on canvas and on surface`, () => {
      for (const status of statuses) {
        const { fg, bg } = r.status[status];
        for (const s of [hex(bg), hex(r.canvas), hex(r.surface)]) {
          expect(contrastRatio(hex(fg), s)).toBeGreaterThanOrEqual(AA.text);
        }
      }
    });

    test(`${theme}: brandFg is AA on brandBg`, () => {
      expect(contrastRatio(hex(r.brandFg), hex(r.brandBg))).toBeGreaterThanOrEqual(AA.text);
    });
  }
});
