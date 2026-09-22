import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Link, defaultExternalLabel, linkTones, linkUnderlines } from "./Link.tsx";

const render = (ui: React.ReactElement): string => renderToStaticMarkup(ui);
const classOf = (html: string): string => /class="([^"]*)"/.exec(html)?.[1] ?? "";

describe("Link", () => {
  test("renders an anchor with the href, link tone and an underline", () => {
    const html = render(<Link href="/eventos">Eventos</Link>);
    expect(html).toMatch(/^<a /);
    expect(html).toContain('href="/eventos"');
    expect(html).toContain('data-tone="link"');
    expect(html).toContain('data-underline="always"');
    const classes = classOf(html).split(" ");
    expect(classes).toContain("text-link");
    expect(classes).toContain("underline");
    expect(html).toContain(">Eventos<");
  });

  test("inherit tone uses the current colour", () => {
    expect(classOf(render(<Link href="#" tone="inherit">x</Link>)).split(" ")).toContain("text-current");
  });

  test("hover underline is off until hover", () => {
    const classes = classOf(render(<Link href="#" underline="hover">x</Link>)).split(" ");
    expect(classes).toContain("no-underline");
    expect(classes).toContain("hover:underline");
  });

  test("external opens a new tab safely and says so", () => {
    const html = render(<Link href="https://seller.example/evento" external>Ver ingressos</Link>);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('data-external="true"');
    expect(html).toContain('data-slot="external-label" class="sr-only"');
    expect(html).toContain(defaultExternalLabel);
  });

  test("externalLabel overrides the hidden note", () => {
    const html = render(<Link href="#" external externalLabel="(opens in a new tab)">x</Link>);
    expect(html).toContain("(opens in a new tab)");
    expect(html).not.toContain(defaultExternalLabel);
  });

  test("not external: no target, rel or note", () => {
    const html = render(<Link href="#">x</Link>);
    expect(html).not.toContain("target=");
    expect(html).not.toContain("rel=");
    expect(html).not.toContain("data-external");
    expect(html).not.toContain("sr-only");
  });

  test("explicit target and rel win over external defaults", () => {
    const html = render(<Link href="#" external target="_self" rel="nofollow">x</Link>);
    expect(html).toContain('target="_self"');
    expect(html).toContain('rel="nofollow"');
  });

  test("uses tokenised motion and focus utilities", () => {
    const html = render(<Link href="#">x</Link>);
    expect(html).toContain("duration-fast");
    expect(html).toContain("ease-standard");
    expect(html).toContain("focus-visible:outline-ring");
  });

  test("className appends, other props pass through", () => {
    const html = render(
      <Link href="#" className="mt-4" id="more" aria-current="page">
        x
      </Link>,
    );
    expect(html).toMatch(/class="[^"]* mt-4"/);
    expect(html).toContain('id="more"');
    expect(html).toContain('aria-current="page"');
  });

  test("never uses accent colour, raw hex or arbitrary values", () => {
    for (const tone of linkTones) {
      for (const underline of linkUnderlines) {
        const className = classOf(render(<Link href="#" tone={tone} underline={underline} external>x</Link>));
        expect(className).not.toMatch(/accent/);
        expect(className).not.toMatch(/#[0-9a-f]{3,8}/i);
        expect(className).not.toMatch(/\[/);
      }
    }
  });
});
