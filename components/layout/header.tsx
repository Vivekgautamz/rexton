import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { primaryNav } from "@/components/layout/site-config";
import { currentUser } from "@/lib/auth/guards";
import { HeaderActions } from "@/components/layout/header-actions";

export async function SiteHeader() {
  const user = await currentUser();
  const navUser = user
    ? { name: user.name, email: user.email }
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/92 backdrop-blur-md">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-20">
        {/* Left — primary navigation */}
        <div className="flex items-center gap-1">
          <MobileMenu user={navUser} />
          <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Primary">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="eyebrow link-underline py-2 text-foreground/80 transition-colors hover:text-foreground text-[11px] tracking-widest uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centre — wordmark */}
        <Logo tagline className="justify-self-center" />

        {/* Right — search, wishlist, cart, account */}
        <div className="flex items-center justify-end">
          <HeaderActions user={navUser} />
        </div>
      </div>
    </header>
  );
}
