/**
 * Link: the navigation primitive. A native `<a>` in the `link` colour role,
 * underlined by default so colour is never the only signal in running text.
 *
 * Usher's core B2C act is handing a person off to a seller's site, so
 * external links are first-class: `external` opens a new tab with a safe
 * `rel`, and appends a visually hidden note so screen reader users hear
 * that the context is about to change.
 *
 * - `tone`: `link` (the role) or `inherit` (current text colour, for links
 *   inside already-coloured text and navigation).
 * - `underline`: `always` (default, inline text) or `hover` (nav lists,
 *   cards, places where the surrounding layout says "these are links").
 * - Actions are `Button`. A link that must look like a button is a later
 *   `LinkButton`, not a `Link` with a `className`.
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn.ts";

export const linkTones = ["link", "inherit"] as const;
export type LinkTone = (typeof linkTones)[number];

export const linkUnderlines = ["always", "hover"] as const;
export type LinkUnderline = (typeof linkUnderlines)[number];

/** Default visually hidden suffix for external links. Portuguese, like all copy. */
export const defaultExternalLabel = "(abre em nova aba)";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> {
  readonly href: string;
  /** Colour role. Defaults to `link`. */
  readonly tone?: LinkTone;
  /** When the underline shows. Defaults to `always`. */
  readonly underline?: LinkUnderline;
  /** Opens in a new tab with a safe `rel` and announces it. Hand-offs to sellers. */
  readonly external?: boolean;
  /** Visually hidden suffix used when `external`. Override for other languages. */
  readonly externalLabel?: string;
  readonly children: ReactNode;
}

const base = cn(
  "rounded-xs transition duration-fast ease-standard",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);

const toneClasses: Readonly<Record<LinkTone, string>> = {
  link: "text-link",
  inherit: "text-current",
};

const underlineClasses: Readonly<Record<LinkUnderline, string>> = {
  always: "underline underline-offset-2 decoration-1 hover:decoration-2",
  hover: "no-underline hover:underline underline-offset-2",
};

export function Link({
  href,
  tone = "link",
  underline = "always",
  external = false,
  externalLabel = defaultExternalLabel,
  className,
  children,
  target,
  rel,
  ...rest
}: LinkProps) {
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = rel ?? (external ? "noopener noreferrer" : undefined);
  return (
    <a
      {...rest}
      href={href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={cn(base, toneClasses[tone], underlineClasses[underline], className)}
      data-tone={tone}
      data-underline={underline}
      data-external={external || undefined}
    >
      {children}
      {external && (
        <span data-slot="external-label" className="sr-only">
          {" "}
          {externalLabel}
        </span>
      )}
    </a>
  );
}
