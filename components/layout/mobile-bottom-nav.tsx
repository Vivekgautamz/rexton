"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Heart, User } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount: wishlistCount } = useWishlist();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Watches", icon: Compass },
    { href: "/search", label: "Search", icon: Search },
    { href: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 block md:hidden border-t border-hairline bg-background/95 backdrop-blur-md pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-gold font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="size-[1.125rem]" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex size-3.5 items-center justify-center rounded-full bg-gold text-[9px] font-mono font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wider uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
