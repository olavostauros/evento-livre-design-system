import { describe, expect, test } from "bun:test";
import { animations, durations, easings, tempos, type AnimationPreset } from "./motion.ts";

describe("motion", () => {
  test("durations ascend and nothing exceeds 500ms before tempo", () => {
    const values = Object.values(durations);
    for (let i = 1; i < values.length; i += 1) expect(values[i]).toBeGreaterThan(values[i - 1] ?? -1);
    expect(Math.max(...values)).toBeLessThanOrEqual(500);
  });

  test("tempos: b2b slower than b2c, reduced is zero (0003)", () => {
    expect(tempos.b2b).toBeLessThan(tempos.b2c);
    expect(tempos.b2c).toBe(1);
    expect(tempos.reduced).toBe(0);
  });

  test("every preset points at a real duration and easing", () => {
    for (const preset of Object.values(animations)) {
      expect(durations).toHaveProperty(preset.duration);
      expect(easings).toHaveProperty(preset.easing);
    }
  });

  test("easings are cubic-bezier strings, except linear for loops", () => {
    for (const [name, value] of Object.entries(easings)) {
      if (name === "linear") expect(value).toBe("linear");
      else expect(value).toMatch(/^cubic-bezier\(/);
    }
  });

  test("linear is used by loops only, and every loop is linear", () => {
    for (const preset of Object.values(animations) as AnimationPreset[]) {
      expect(preset.easing === "linear").toBe(preset.loop === true);
    }
  });
});
