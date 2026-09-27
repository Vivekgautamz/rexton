"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { primaryNav, accountNav } from "@/components/layout/site-config";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  user: { name: string; email: string } | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const visibleAccountLinks = user
    ? accountNav.filter((link) => link.href === "/account")
    : accountNav.filter((link) => link.href !== "/account");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[86vw] max-w-sm p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-hairline px-6 py-6">
          <SheetTitle asChild>
            <Logo href="/" tagline />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-6 py-4">
          <p className="eyebrow mb-4 text-muted-foreground">Menu</p>
          {[...primaryNav, ...visibleAccountLinks].map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "border-b border-hairline py-4 font-display text-2xl transition-colors hover:text-gold",
                pathname === link.href && "text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-hairline px-6 py-6">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full border border-hairline">
                  <User className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <form action={logoutAction} className="w-full">
                <Button type="submit" variant="outline" className="w-full gap-2">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="grid gap-2">
              <Button asChild className="w-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Create account
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
