import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Label } from "./Label.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);
const classOf = (html: string): string => /class="([^"]*)"/.exec(html)?.[1] ?? "";

describe("Label", () => {
  test("renders a native label in the label text style", () => {
    const html = render(<Label htmlFor="email">E-mail</Label>);
    expect(html).toMatch(/^<label /);
    expect(html).toContain('for="email"');
    expect(classOf(html).split(" ")).toContain("type-label");
    expect(classOf(html).split(" ")).toContain("text-fg");
    expect(html).toContain(">E-mail<");
  });

  test("required adds a decorative marker", () => {
    const html = render(<Label required>Nome</Label>);
    expect(html).toContain('data-required="true"');
    expect(html).toContain('aria-hidden="true" data-slot="required"');
    expect(html).toContain("text-status-danger-fg");
    expect(html).toContain(">*<");
  });

  test("not required: no marker", () => {
    const html = render(<Label>Nome</Label>);
    expect(html).not.toContain("data-required");
    expect(html).not.toContain('data-slot="required"');
  });

  test("className appends, other props pass through", () => {
    const html = render(
      <Label className="mb-2" id="lbl">
        x
      </Label>,
    );
    expect(html).toMatch(/class="[^"]* mb-2"/);
    expect(html).toContain('id="lbl"');
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    const className = classOf(render(<Label required>x</Label>));
    expect(className).not.toMatch(/accent/);
    expect(className).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(className).not.toMatch(/\[/);
  });
});
