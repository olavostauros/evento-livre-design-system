import { describe, expect, test } from "bun:test";
import { themes } from "./colors.ts";
import { elevationLevels, shadows } from "./elevation.ts";

describe("elevation", () => {
  test("level 0 casts no shadow in either theme", () => {
    for (const theme of themes) expect(shadows[theme][0]).toHaveLength(0);
  });

  test("light shadows are soft: low alpha, blur at least twice the offset", () => {
    for (const level of elevationLevels) {
      for (const layer of shadows.light[level]) {
        expect(layer.alpha).toBeLessThanOrEqual(0.2);
        expect(layer.blur).toBeGreaterThanOrEqual(layer.y * 2);
      }
    }
  });

  test("higher levels reach further", () => {
    for (const theme of themes) {
      let previous = -1;
      for (const level of elevationLevels) {
        const reach = Math.max(0, ...shadows[theme][level].map((l) => l.y + l.blur));
        expect(reach).toBeGreaterThanOrEqual(previous);
        previous = reach;
      }
    }
  });
});
