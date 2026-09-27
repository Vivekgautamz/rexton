"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { adminLogoutAction } from "@/lib/actions/admin-auth";

export function AdminTopbar({ user }: { user: { name: string; role: string } }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-hairline bg-background/95 px-5 py-4 backdrop-blur lg:hidden">
      <Logo href="/admin" tagline className="items-start" />

      <div className="flex items-center gap-1">
        <span className="mr-2 hidden text-right sm:block">
          <span className="block text-xs font-medium leading-tight">
            {user.name}
          </span>
          <span className="eyebrow block text-muted-foreground">
            {user.role}
          </span>
        </span>

        <Button asChild variant="ghost" size="icon" aria-label="View storefront">
          <Link href="/">
            <ExternalLink className="size-4" />
          </Link>
        </Button>

        <form action={adminLogoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
