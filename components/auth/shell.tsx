import Link from "next/link";
import { Logo } from "@/components/layout/logo";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Shared chrome for sign-in, registration and password recovery so the three
 * screens feel like one considered flow rather than three forms.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="container-page grid gap-16 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-24 lg:py-24">
      {/* Editorial panel */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:min-h-[30rem]">
        <Logo href="/" tagline className="items-start" />
        <div>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.95]">
            Every second
            <br />
            accounted for.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your REXTON account keeps orders, addresses, warranty records and
            saved pieces in one secure place.
          </p>
        </div>
        <div className="rule" />
      </div>

      {/* Form panel */}
      <div className="mx-auto w-full max-w-md">
        <div className="lg:hidden">
          <Logo href="/" tagline className="mb-10 items-start" />
        </div>

        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-5 text-4xl leading-tight">{title}</h2>
        {description ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}

        <div className="mt-10">{children}</div>

        {footer ? (
          <div className="mt-8 border-t border-hairline pt-6 text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}

        <p className="mt-10 text-xs text-muted-foreground">
          <Link href="/" className="link-underline hover:text-foreground">
            ← Back to REXTON
          </Link>
        </p>
      </div>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}
