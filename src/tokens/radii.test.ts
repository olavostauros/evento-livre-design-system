import { describe, expect, test } from "bun:test";
import { radii, radiusRoles } from "./radii.ts";

describe("radii", () => {
  test("scale ascends from none to full", () => {
    const values = Object.values(radii);
    for (let i = 1; i < values.length; i += 1) expect(values[i]).toBeGreaterThan(values[i - 1] ?? -1);
  });

  test("soft and rounded (0006): controls at least 12px, containers at least 16px", () => {
    expect(radii[radiusRoles.control]).toBeGreaterThanOrEqual(12);
    expect(radii[radiusRoles.container]).toBeGreaterThanOrEqual(16);
    expect(radii[radiusRoles.chip]).toBe(radii.full);
  });
});
