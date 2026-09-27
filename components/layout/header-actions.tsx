"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { logoutAction } from "@/lib/actions/auth";

interface HeaderActionsProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export function HeaderActions({ user }: HeaderActionsProps) {
  const { itemCount, setIsOpen: setIsCartOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Search icon */}
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="size-9 text-foreground/80 hover:text-foreground"
        title="Search watches"
      >
        <Link href="/search" aria-label="Search watches">
          <Search className="size-[1.125rem]" />
        </Link>
      </Button>

      {/* Wishlist icon with badge */}
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative size-9 text-foreground/80 hover:text-foreground"
        title="Saved timepieces"
      >
        <Link href="/wishlist" aria-label="Wishlist">
          <Heart className="size-[1.125rem]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-mono font-medium text-white shadow-xs">
              {wishlistCount}
            </span>
          )}
        </Link>
      </Button>

      {/* Cart button with badge */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCartOpen(true)}
        className="relative size-9 text-foreground/80 hover:text-foreground"
        title="Shopping bag"
        aria-label="Shopping bag"
      >
        <ShoppingBag className="size-[1.125rem]" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-ink text-[10px] font-mono font-medium text-paper shadow-xs">
            {itemCount}
          </span>
        )}
      </Button>

      {/* Account controls */}
      {user ? (
        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            className="hidden h-9 gap-2 px-2.5 text-xs font-medium sm:inline-flex"
          >
            <Link href="/account">
              <User className="size-4" />
              <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span>
            </Link>
          </Button>
          <Link
            href="/account"
            className="flex size-9 items-center justify-center text-foreground/80 hover:text-gold sm:hidden"
            aria-label="Your account"
          >
            <User className="size-5" />
          </Link>
          <form action={logoutAction} className="hidden sm:block">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground hover:text-destructive"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="eyebrow hidden link-underline py-2 text-foreground/80 transition-colors hover:text-foreground sm:block text-[11px]"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="flex size-9 items-center justify-center text-foreground/80 hover:text-gold sm:hidden"
            aria-label="Sign in"
          >
            <User className="size-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
