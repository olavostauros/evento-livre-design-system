import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Input, inputSizes, inputTypes } from "./Input.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);
const classOf = (html: string): string => /class="([^"]*)"/.exec(html)?.[1] ?? "";

describe("Input", () => {
  test("renders a native text input at md, full width", () => {
    const html = render(<Input />);
    expect(html).toMatch(/^<input /);
    expect(html).toContain('type="text"');
    expect(html).toContain('data-size="md"');
    const classes = classOf(html).split(" ");
    expect(classes).toContain("w-full");
    expect(classes).toContain("h-control-md");
  });

  test("every text-like type passes through", () => {
    for (const type of inputTypes) expect(render(<Input type={type} />)).toContain(`type="${type}"`);
  });

  test("every size uses density utilities; md and lg keep 16px on phones", () => {
    for (const size of inputSizes) {
      const classes = classOf(render(<Input size={size} />)).split(" ");
      expect(classes).toContain(`h-control-${size}`);
      expect(classes).toContain(`px-inset-${size}`);
      expect(classes).toContain(size === "sm" ? "text-sm" : "text-base");
    }
  });

  test("uses role, radius, motion and focus utilities", () => {
    const classes = classOf(render(<Input />)).split(" ");
    for (const c of [
      "rounded-control",
      "border-border-strong",
      "bg-surface",
      "text-fg",
      "placeholder:text-fg-subtle",
      "duration-fast",
      "ease-standard",
      "focus:outline-ring",
      "aria-invalid:border-status-danger-fg",
      "read-only:bg-surface-sunken",
    ]) {
      expect(classes).toContain(c);
    }
  });

  test("invalid sets aria-invalid and the data hook", () => {
    const html = render(<Input invalid />);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('data-invalid="true"');
    const plain = render(<Input />);
    expect(plain).not.toContain('aria-invalid="');
    expect(plain).not.toContain("data-invalid");
  });

  test("native states and wiring pass through", () => {
    const html = render(
      <Input
        id="email"
        name="email"
        required
        disabled
        readOnly
        placeholder="voce@exemplo.com"
        autoComplete="email"
        aria-describedby="email-help"
      />,
    );
    expect(html).toContain('id="email"');
    expect(html).toContain('name="email"');
    expect(html).toContain(" required=");
    expect(html).toContain(" disabled=");
    expect(html).toMatch(/ readonly=/i);
    expect(html).toContain('placeholder="voce@exemplo.com"');
    expect(html).toMatch(/autocomplete="email"/i);
    expect(html).toContain('aria-describedby="email-help"');
  });

  test("className appends", () => {
    expect(render(<Input className="max-w-sm" />)).toMatch(/class="[^"]* max-w-sm"/);
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    for (const size of inputSizes) {
      const className = classOf(render(<Input size={size} invalid />));
      expect(className).not.toMatch(/accent/);
      expect(className).not.toMatch(/#[0-9a-f]{3,8}/i);
      expect(className).not.toMatch(/\[/);
    }
  });
});
