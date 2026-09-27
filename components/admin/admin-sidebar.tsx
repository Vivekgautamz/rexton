"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { adminLogoutAction } from "@/lib/actions/admin-auth";
import { ADMIN_NAV_ICONS, type AdminNavItem } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  items: AdminNavItem[];
  user: { name: string; email: string; role: string };
}

export function AdminSidebar({ items, user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-hairline bg-card lg:flex">
      <div className="border-b border-hairline px-6 py-6">
        <Logo tagline className="items-start" href="/admin" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Admin">
        <p className="eyebrow px-3 text-muted-foreground">Dashboard</p>
        <ul className="mt-4 space-y-1">
          {items.map((item) => {
            const Icon = ADMIN_NAV_ICONS[item.icon];
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 transition-colors",
                      active ? "bg-gold" : "bg-transparent"
                    )}
                  />
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-hairline p-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="eyebrow mt-1 text-muted-foreground">{user.role}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            asChild
            variant="ghost"
            className="justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ExternalLink className="size-4" />
              View storefront
            </Link>
          </Button>

          <form action={adminLogoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
