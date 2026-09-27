"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface WishlistItemData {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number | null;
  collectionName?: string;
  categoryName?: string;
  movement?: string;
}

interface WishlistContextType {
  items: WishlistItemData[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItemData) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "rexton_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItemData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Storage error fallback
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage error fallback
    }
  }, [items, mounted]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const toggleWishlist = (item: WishlistItemData) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === item.productId);
      if (exists) {
        toast.info(`"${item.name}" removed from Wishlist`);
        return prev.filter((i) => i.productId !== item.productId);
      } else {
        toast.success(`"${item.name}" added to Wishlist`);
        return [...prev, item];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.productId === productId);
      if (target) {
        toast.info(`"${target.name}" removed from Wishlist`);
      }
      return prev.filter((i) => i.productId !== productId);
    });
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
