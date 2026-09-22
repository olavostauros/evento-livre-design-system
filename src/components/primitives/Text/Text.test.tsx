import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { textStyles } from "../../../tokens/typography.ts";
import { Text, defaultElements, textAligns, textTones, textVariants } from "./Text.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);
const classOf = (html: string): string => /class="([^"]*)"/.exec(html)?.[1] ?? "";

describe("Text", () => {
  test("defaults to body in a paragraph with the fg tone", () => {
    const html = render(<Text>Olá</Text>);
    expect(html).toMatch(/^<p /);
    expect(html).toContain("type-body");
    expect(html).toContain("text-fg");
    expect(html).toContain('data-variant="body"');
    expect(html).toContain('data-tone="default"');
    expect(html).toContain(">Olá<");
  });

  test("variants are exactly the typography token styles", () => {
    expect([...textVariants].map(String).sort()).toEqual(Object.keys(textStyles).sort());
  });

  test("every variant renders its type utility and default element", () => {
    for (const variant of textVariants) {
      const html = render(<Text variant={variant}>x</Text>);
      expect(html).toMatch(new RegExp(`^<${defaultElements[variant]} `));
      expect(classOf(html).split(" ")).toContain(`type-${variant}`);
      expect(html).toContain(`data-variant="${variant}"`);
    }
  });

  test("as overrides the element", () => {
    expect(render(<Text variant="title" as="h1">x</Text>)).toMatch(/^<h1 /);
    expect(render(<Text as="span">x</Text>)).toMatch(/^<span /);
  });

  test("overline is uppercased by the component", () => {
    expect(classOf(render(<Text variant="overline">x</Text>)).split(" ")).toContain("uppercase");
    expect(classOf(render(<Text variant="body">x</Text>)).split(" ")).not.toContain("uppercase");
  });

  test("every tone maps to a foreground role", () => {
    for (const tone of textTones) {
      const classes = classOf(render(<Text tone={tone}>x</Text>)).split(" ");
      const role = classes.find((c) => c.startsWith("text-fg") || c.startsWith("text-brand") || c.startsWith("text-status"));
      expect(role).toBeDefined();
      expect(role).toMatch(/^text-(fg|fg-\w+|brand-fg|status-\w+-fg)$/);
    }
  });

  test("align and truncate are opt in", () => {
    const plain = classOf(render(<Text>x</Text>));
    expect(plain).not.toMatch(/text-(start|center|end)/);
    expect(plain).not.toContain("truncate");
    for (const align of textAligns) {
      expect(classOf(render(<Text align={align}>x</Text>))).toContain(`text-${align}`);
    }
    expect(classOf(render(<Text truncate>x</Text>)).split(" ")).toContain("truncate");
  });

  test("className appends, other props pass through", () => {
    const html = render(
      <Text className="mt-4" id="lead" aria-live="polite">
        x
      </Text>,
    );
    expect(html).toMatch(/class="[^"]* mt-4"/);
    expect(html).toContain('id="lead"');
    expect(html).toContain('aria-live="polite"');
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    for (const variant of textVariants) {
      for (const tone of textTones) {
        const className = classOf(render(<Text variant={variant} tone={tone}>x</Text>));
        expect(className).not.toMatch(/accent/);
        expect(className).not.toMatch(/#[0-9a-f]{3,8}/i);
        expect(className).not.toMatch(/\[/);
      }
    }
  });
});
