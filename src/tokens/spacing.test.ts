import { describe, expect, test } from "bun:test";
import { registers } from "./colors.ts";
import { density, densityKeys, spacingBase } from "./spacing.ts";

describe("density", () => {
  for (const register of registers) {
    test(`${register}: every value is a multiple of the base unit`, () => {
      for (const key of densityKeys) expect(density[register][key] % spacingBase).toBe(0);
    });

    test(`${register}: controls meet the WCAG 2.5.8 minimum target of 24px`, () => {
      expect(density[register]["control-sm"]).toBeGreaterThanOrEqual(24);
    });

    test(`${register}: sm < md < lg`, () => {
      for (const group of ["control", "inset", "stack"] as const) {
        expect(density[register][`${group}-sm`]).toBeLessThan(density[register][`${group}-md`]);
        expect(density[register][`${group}-md`]).toBeLessThan(density[register][`${group}-lg`]);
      }
    });
  }

  test("b2c default control is a 44px touch target", () => {
    expect(density.b2c["control-md"]).toBeGreaterThanOrEqual(44);
  });

  test("b2b is never roomier than b2c, except the page gutter", () => {
    for (const key of densityKeys) {
      if (key === "gutter") continue;
      expect(density.b2b[key]).toBeLessThanOrEqual(density.b2c[key]);
    }
  });
});
