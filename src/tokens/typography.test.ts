import { describe, expect, test } from "bun:test";
import { registers } from "./colors.ts";
import { fontFamilies, textStyles, typeScale, typeSteps } from "./typography.ts";

describe("type scale", () => {
  for (const register of registers) {
    test(`${register}: nothing below 12px, line-height above size, sizes ascend`, () => {
      let previous = 0;
      for (const step of typeSteps) {
        const { size, lineHeight } = typeScale[register][step];
        expect(size).toBeGreaterThanOrEqual(12);
        expect(lineHeight).toBeGreaterThan(size);
        expect(size).toBeGreaterThanOrEqual(previous);
        previous = size;
      }
    });

    test(`${register}: line-heights sit on the 2px grid`, () => {
      for (const step of typeSteps) expect(typeScale[register][step].lineHeight % 2).toBe(0);
    });
  }

  test("b2b is never larger than b2c at the same step", () => {
    for (const step of typeSteps) {
      expect(typeScale.b2b[step].size).toBeLessThanOrEqual(typeScale.b2c[step].size);
    }
  });
});

describe("text styles", () => {
  test("the display face is only used by styles that fall back to sans on B2B", () => {
    for (const style of Object.values(textStyles)) {
      if (style.family === "display") expect(style.displayOnB2cOnly).toBe(true);
    }
  });

  test("every family stack ends in a generic family", () => {
    for (const stack of Object.values(fontFamilies)) {
      expect(["sans-serif", "monospace", "serif"]).toContain(stack.at(-1) ?? "");
    }
  });
});
