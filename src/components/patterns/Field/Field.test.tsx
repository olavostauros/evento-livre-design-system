import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FieldContext, useFieldControl } from "../../../hooks/useFieldControl.ts";
import { Field } from "./Field.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);
const attr = (html: string, tag: string, name: string): string | undefined =>
  new RegExp(`<${tag}[^>]*\\s${name}="([^"]*)"`).exec(html)?.[1];
const classOf = (html: string): string => /class="([^"]*)"/.exec(html)?.[1] ?? "";

/** A minimal opt-in control, so the test does not depend on Input. */
function Control(props: { readonly id?: string; readonly "aria-describedby"?: string }) {
  const wired = useFieldControl(props);
  return <input {...wired} />;
}

describe("Field", () => {
  test("renders a div with the stack gap, a label, and the control in between", () => {
    const html = render(
      <Field label="E-mail">
        <Control />
      </Field>,
    );
    expect(html).toMatch(/^<div /);
    expect(classOf(html).split(" ")).toContain("gap-stack-sm");
    expect(html).toMatch(/<label[^>]*>E-mail<\/label><input /);
  });

  test("label for equals the control id, generated or explicit", () => {
    const generated = render(
      <Field label="x">
        <Control />
      </Field>,
    );
    const htmlFor = attr(generated, "label", "for");
    expect(htmlFor).toBeTruthy();
    expect(attr(generated, "input", "id")).toBe(htmlFor);

    const explicit = render(
      <Field label="x" id="email" description="d" error="e">
        <Control />
      </Field>,
    );
    expect(attr(explicit, "label", "for")).toBe("email-control");
    expect(attr(explicit, "input", "id")).toBe("email-control");
    expect(explicit).toContain('id="email-description"');
    expect(explicit).toContain('id="email-error"');
  });

  test("description and error are body-sm paragraphs in the muted and danger roles, in DOM order", () => {
    const html = render(
      <Field label="x" id="f" description="Hint" error="Wrong">
        <Control />
      </Field>,
    );
    const description = /<p[^>]*data-slot="description"[^>]*>Hint<\/p>/.exec(html)?.[0] ?? "";
    const error = /<p[^>]*data-slot="error"[^>]*>Wrong<\/p>/.exec(html)?.[0] ?? "";
    expect(description).toContain("type-body-sm");
    expect(description).toContain("text-fg-muted");
    expect(error).toContain("type-body-sm");
    expect(error).toContain("text-status-danger-fg");
    expect(html.indexOf("<label")).toBeLessThan(html.indexOf(description));
    expect(html.indexOf(description)).toBeLessThan(html.indexOf("<input"));
    expect(html.indexOf("<input")).toBeLessThan(html.indexOf(error));
  });

  test("aria-describedby lists description then error, or is absent", () => {
    const both = render(
      <Field label="x" id="f" description="d" error="e">
        <Control />
      </Field>,
    );
    expect(attr(both, "input", "aria-describedby")).toBe("f-description f-error");

    const onlyDescription = render(
      <Field label="x" id="f" description="d">
        <Control />
      </Field>,
    );
    expect(attr(onlyDescription, "input", "aria-describedby")).toBe("f-description");

    const onlyError = render(
      <Field label="x" id="f" error="e">
        <Control />
      </Field>,
    );
    expect(attr(onlyError, "input", "aria-describedby")).toBe("f-error");

    const neither = render(
      <Field label="x" id="f">
        <Control />
      </Field>,
    );
    expect(neither).not.toContain("aria-describedby");
  });

  test("error marks the control invalid and the root data-invalid; no error leaves both absent", () => {
    const withError = render(
      <Field label="x" error="e">
        <Control />
      </Field>,
    );
    expect(withError).toMatch(/^<div [^>]*data-invalid="true"/);
    expect(attr(withError, "input", "aria-invalid")).toBe("true");

    const plain = render(
      <Field label="x">
        <Control />
      </Field>,
    );
    expect(plain).not.toContain("data-invalid");
    expect(plain).not.toContain("aria-invalid");
    expect(plain).not.toContain('data-slot="error"');
  });

  test("required sets the label marker and required on the control", () => {
    const html = render(
      <Field label="x" required>
        <Control />
      </Field>,
    );
    expect(html).toContain('data-required="true"');
    expect(html).toContain('data-slot="required"');
    expect(html).toMatch(/<input [^>]*\srequired=/);
  });

  test("the control's own props win, and its own aria-describedby is kept first", () => {
    const html = render(
      <Field label="x" id="f" description="d">
        <Control id="mine" aria-describedby="extra" />
      </Field>,
    );
    expect(attr(html, "input", "id")).toBe("mine");
    expect(attr(html, "input", "aria-describedby")).toBe("extra f-description");
  });

  test("className appends and other props pass through", () => {
    const html = render(
      <Field label="x" className="max-w-sm" data-testid="field">
        <Control />
      </Field>,
    );
    expect(html).toMatch(/^<div [^>]*class="[^"]* max-w-sm"/);
    expect(html).toContain('data-testid="field"');
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    const html = render(
      <Field label="x" description="d" error="e" required>
        <Control />
      </Field>,
    );
    for (const className of html.matchAll(/class="([^"]*)"/g)) {
      expect(className[1]).not.toMatch(/accent/);
      expect(className[1]).not.toMatch(/#[0-9a-f]{3,8}/i);
      expect(className[1]).not.toMatch(/\[/);
    }
  });

  test("provides FieldContext only to the children", () => {
    function Outside() {
      const wired = useFieldControl({});
      return <b data-id={wired.id} />;
    }
    const html = render(
      <>
        <Field label="x" id="f">
          <Control />
        </Field>
        <Outside />
      </>,
    );
    expect(html).toContain("<b></b>");
    expect(FieldContext).toBeDefined();
  });
});
