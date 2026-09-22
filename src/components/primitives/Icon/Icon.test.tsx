import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { iconGrid, iconSizes, iconStrokeWidth } from "../../../tokens/icons.ts";
import { Icon, iconSizeNames } from "./Icon.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);
const classOf = (html: string): string => /class="([^"]*)"/.exec(html)?.[1] ?? "";
const glyph = <path d="M4 12h16" />;

describe("Icon", () => {
  test("is an svg on the drawing grid with the shared stroke", () => {
    const html = render(<Icon>{glyph}</Icon>);
    expect(html).toMatch(/^<svg /);
    expect(html).toContain(`viewBox="0 0 ${iconGrid} ${iconGrid}"`);
    expect(html).toContain(`stroke-width="${iconStrokeWidth}"`);
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('fill="none"');
    expect(html).toContain('stroke-linecap="round"');
    expect(html).toContain('stroke-linejoin="round"');
    expect(html).toContain('<path d="M4 12h16"></path>');
  });

  test("is decorative by default", () => {
    const html = render(<Icon>{glyph}</Icon>);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("role=");
    expect(html).not.toContain("aria-label=");
  });

  test("label makes it an image with a name", () => {
    const html = render(<Icon label="Alerta ativo">{glyph}</Icon>);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Alerta ativo"');
    expect(html).not.toContain("aria-hidden");
  });

  test("sizes are exactly the icon tokens and each renders its utility", () => {
    expect([...iconSizeNames].map(String).sort()).toEqual(Object.keys(iconSizes).sort());
    for (const size of iconSizeNames) {
      const html = render(<Icon size={size}>{glyph}</Icon>);
      expect(classOf(html).split(" ")).toContain(`size-icon-${size}`);
      expect(html).toContain(`data-size="${size}"`);
    }
    expect(classOf(render(<Icon>{glyph}</Icon>))).toContain("size-icon-md");
  });

  test("viewBox and box size cannot be overridden by props", () => {
    // @ts-expect-error viewBox is not a prop
    const html = render(<Icon viewBox="0 0 16 16" width={99}>{glyph}</Icon>);
    expect(html).toContain(`viewBox="0 0 ${iconGrid} ${iconGrid}"`);
  });

  test("className appends, other svg props pass through", () => {
    const html = render(
      <Icon className="text-fg-muted" data-testid="i">
        {glyph}
      </Icon>,
    );
    expect(html).toMatch(/class="[^"]* text-fg-muted"/);
    expect(html).toContain('data-testid="i"');
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    for (const size of iconSizeNames) {
      const className = classOf(render(<Icon size={size}>{glyph}</Icon>));
      expect(className).not.toMatch(/accent/);
      expect(className).not.toMatch(/#[0-9a-f]{3,8}/i);
      expect(className).not.toMatch(/\[/);
    }
  });
});
