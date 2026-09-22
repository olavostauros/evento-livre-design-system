import { describe, expect, test } from "bun:test";
import { iconGrid, iconSizes, iconStrokeWidth } from "./icons.ts";
import { spacingBase } from "./spacing.ts";

describe("icons", () => {
  test("sizes ascend and sit on the spacing base", () => {
    const values = Object.values(iconSizes);
    for (let i = 1; i < values.length; i++) expect(values[i]).toBeGreaterThan(values[i - 1]!);
    for (const px of values) expect(px % spacingBase).toBe(0);
  });

  test("the smallest icon is still readable (semiotics: reads at 16px)", () => {
    expect(iconSizes.sm).toBeGreaterThanOrEqual(16);
  });

  test("grid matches the largest size so lg renders 1:1", () => {
    expect(iconGrid).toBe(iconSizes.lg);
  });

  test("stroke is neither hairline nor heavy at 16px", () => {
    expect(iconStrokeWidth).toBeGreaterThanOrEqual(1);
    expect(iconStrokeWidth).toBeLessThanOrEqual(2);
  });
});
