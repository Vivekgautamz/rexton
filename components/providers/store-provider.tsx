"use client";

import React from "react";
import { CartProvider } from "@/components/cart/cart-context";
import { WishlistProvider } from "@/components/wishlist/wishlist-context";
import { CartSheet } from "@/components/cart/cart-sheet";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CartSheet />
      </WishlistProvider>
    </CartProvider>
  );
}
