/**
 * Join class names, dropping anything falsy. Tailwind v4 has no conflicting
 * utilities in the way this system composes them (variants pick one class
 * per concern), so no merge logic is needed. Add it only if a real conflict
 * appears, and record the dependency first.
 */
export type ClassValue = string | false | null | undefined | 0;

export function cn(...values: ClassValue[]): string {
  let out = "";
  for (const value of values) {
    if (!value) continue;
    out = out ? `${out} ${value}` : value;
  }
  return out;
}
