import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FieldContext, useFieldControl, type FieldControlProps } from "./useFieldControl.ts";

/** Render the merged props as data attributes so the markup can be read back. */
function Probe(own: FieldControlProps) {
  const merged = useFieldControl(own);
  return (
    <i
      data-id={merged.id}
      data-describedby={merged["aria-describedby"]}
      data-invalid={merged["aria-invalid"]}
      data-required={merged.required}
    />
  );
}

const render = (own: FieldControlProps, field: FieldControlProps | null = null): string =>
  renderToStaticMarkup(
    <FieldContext.Provider value={field}>
      <Probe {...own} />
    </FieldContext.Provider>,
  );

const fieldValue: FieldControlProps = {
  id: "f-control",
  "aria-describedby": "f-description f-error",
  "aria-invalid": true,
  required: true,
};

describe("useFieldControl", () => {
  test("outside a Field, own props come back untouched", () => {
    expect(render({})).toBe("<i></i>");
    const html = render({ id: "own", "aria-describedby": "help" });
    expect(html).toContain('data-id="own"');
    expect(html).toContain('data-describedby="help"');
    expect(html).not.toContain("data-invalid");
    expect(html).not.toContain("data-required");
  });

  test("inside a Field with no own props, the Field's props apply", () => {
    const html = render({}, fieldValue);
    expect(html).toContain('data-id="f-control"');
    expect(html).toContain('data-describedby="f-description f-error"');
    expect(html).toContain('data-invalid="true"');
    expect(html).toContain('data-required="true"');
  });

  test("own props win key by key", () => {
    const html = render({ id: "own" }, fieldValue);
    expect(html).toContain('data-id="own"');
    expect(html).toContain('data-invalid="true"'); // still from the Field
  });

  test("aria-describedby joins, own ids first", () => {
    const html = render({ "aria-describedby": "help" }, fieldValue);
    expect(html).toContain('data-describedby="help f-description f-error"');
  });

  test("a Field with nothing to describe leaves aria-describedby absent", () => {
    const html = render({}, { id: "f-control" });
    expect(html).toContain('data-id="f-control"');
    expect(html).not.toContain("data-describedby");
  });
});
