import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { footerColumns } from "@/components/layout/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-hairline bg-background">
      <div className="container-page">
        {/* Newsletter */}
        <div className="grid gap-10 border-b border-hairline py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <p className="eyebrow text-muted-foreground">Newsletter</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
              Join the REXTON world.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              New releases, limited editions and stories from the workshop.
              Sent sparingly, never shared.
            </p>
          </div>
          <div className="lg:self-end lg:pb-2">
            <NewsletterForm />
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(2,1fr)]">
          <div className="max-w-sm">
            <Logo href="/" tagline className="items-start" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              REXTON builds Swiss-inspired timepieces for people who measure
              life in moments, not minutes. Designed in India, assembled to
              exacting tolerances.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="eyebrow text-muted-foreground">{column.title}</p>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-foreground/75 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {year} REXTON Watches. All rights reserved.</p>
          <p className="eyebrow">Swiss Timeless Root</p>
        </div>
      </div>
    </footer>
  );
}
