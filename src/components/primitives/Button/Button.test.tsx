import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, buttonSizes, buttonVariants } from "./Button.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);

describe("Button", () => {
  test("renders a native button of type button by default", () => {
    const html = render(<Button>Entrar</Button>);
    expect(html).toMatch(/^<button [^>]*type="button"/);
    expect(html).toContain(">Entrar<");
  });

  test("type can be submit", () => {
    expect(render(<Button type="submit">Enviar</Button>)).toContain('type="submit"');
  });

  test("defaults to secondary md; primary is a choice", () => {
    const html = render(<Button>x</Button>);
    expect(html).toContain('data-variant="secondary"');
    expect(html).toContain('data-size="md"');
    expect(html).toContain("h-control-md");
  });

  test("every variant and size renders and uses role or density utilities", () => {
    for (const variant of buttonVariants) {
      for (const size of buttonSizes) {
        const html = render(
          <Button variant={variant} size={size}>
            x
          </Button>,
        );
        expect(html).toContain(`data-variant="${variant}"`);
        expect(html).toContain(`h-control-${size}`);
        expect(html).toContain(`px-inset-${size}`);
      }
    }
  });

  test("primary uses the brand solid role and inverse text", () => {
    const html = render(<Button variant="primary">x</Button>);
    expect(html).toContain("bg-brand-solid");
    expect(html).toContain("text-fg-inverse");
  });

  test("danger uses the danger status solid role", () => {
    expect(render(<Button variant="danger">x</Button>)).toContain("bg-status-danger-solid");
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    for (const variant of buttonVariants) {
      const html = render(<Button variant={variant}>x</Button>);
      const className = /class="([^"]*)"/.exec(html)?.[1] ?? "";
      expect(className).not.toMatch(/accent/);
      expect(className).not.toMatch(/#[0-9a-f]{3,8}/i);
      expect(className).not.toMatch(/\[/);
    }
  });

  test("uses tokenised radius, motion and focus utilities", () => {
    const html = render(<Button>x</Button>);
    expect(html).toContain("rounded-control");
    expect(html).toContain("duration-fast");
    expect(html).toContain("ease-standard");
    expect(html).toContain("focus-visible:outline-ring");
  });

  test("disabled sets the native attribute", () => {
    expect(render(<Button disabled>x</Button>)).toContain(" disabled=");
  });

  test("loading is busy and aria-disabled but not natively disabled, and shows the spinner", () => {
    const html = render(<Button loading>x</Button>);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain(" disabled=");
    expect(html).toContain('data-slot="spinner"');
    expect(html).toContain("animate-spin");
    expect(html).toContain(">x<"); // the label stays so the width does not jump
  });

  test("loading replaces iconStart and keeps iconEnd", () => {
    const html = render(
      <Button loading iconStart={<svg data-testid="start" />} iconEnd={<svg data-testid="end" />}>
        x
      </Button>,
    );
    expect(html).not.toContain('data-slot="icon-start"');
    expect(html).toContain('data-slot="icon-end"');
  });

  test("icons are decorative", () => {
    const html = render(
      <Button iconStart={<svg />} iconEnd={<svg />}>
        x
      </Button>,
    );
    expect(html).toContain('aria-hidden="true" data-slot="icon-start"');
    expect(html).toContain('aria-hidden="true" data-slot="icon-end"');
  });

  test("fullWidth stretches, className appends, other props pass through", () => {
    const html = render(
      <Button fullWidth className="mt-4" id="cta" aria-label="Comprar ingresso">
        x
      </Button>,
    );
    expect(html).toContain("w-full");
    expect(html).toMatch(/class="[^"]* mt-4"/);
    expect(html).toContain('id="cta"');
    expect(html).toContain('aria-label="Comprar ingresso"');
  });
});
