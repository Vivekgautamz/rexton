import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tagline?: boolean;
  /** Home links in the storefront; admin renders a plain span. */
  href?: string | null;
}

export function Logo({ className, tagline = false, href = "/" }: LogoProps) {
  const inner = (
    <span className={cn("group inline-flex flex-col items-center", className)}>
      <span
        className="text-[17px] font-medium uppercase leading-none sm:text-[19px]"
        style={{ letterSpacing: "0.44em", textIndent: "0.44em" }}
      >
        Rexton
      </span>
      {tagline ? (
        <span
          className="mt-2 text-[9px] uppercase leading-none text-muted-foreground transition-colors group-hover:text-gold"
          style={{ letterSpacing: "0.3em", textIndent: "0.3em" }}
        >
          Swiss Timeless Root
        </span>
      ) : null}
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} aria-label="REXTON Watches — home" className="fade-in">
      {inner}
    </Link>
  );
}
