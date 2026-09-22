import { describe, expect, test } from "bun:test";
import { cn } from "./cn.ts";

describe("cn", () => {
  test("joins strings with single spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  test("drops falsy values", () => {
    expect(cn("a", false, null, undefined, 0, "b")).toBe("a b");
  });

  test("returns an empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
