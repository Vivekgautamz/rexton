"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItemData {
  id: string; // unique item id or productId-variantId
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  sku: string;
  imageUrl: string;
  price: number; // in paise
  compareAtPrice?: number | null;
  quantity: number;
  collectionName?: string;
  categoryName?: string;
  variantName?: string;
  maxStock?: number;
}

interface CartContextType {
  items: CartItemData[];
  itemCount: number;
  subtotal: number; // in paise
  discount: number; // in paise
  shipping: number; // in paise (0 for complimentary)
  total: number; // in paise
  couponCode: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItemData, "id"> & { id?: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rexton_cart_v1";
const COUPON_STORAGE_KEY = "rexton_coupon_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setCouponCode(storedCoupon);
      }
    } catch {
      // Storage error fallback
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage error fallback
    }
  }, [items, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (couponCode) {
        localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Storage error fallback
    }
  }, [couponCode, mounted]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 10% discount if coupon is applied (e.g. REXTON10 or SWISS10)
  const discount =
    couponCode && subtotal > 0
      ? Math.round(subtotal * 0.1) // 10% default promo calculation
      : 0;

  // Complimentary shipping across India on all timepieces
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const addItem = (item: Omit<CartItemData, "id"> & { id?: string }) => {
    const id = item.id || `${item.productId}-${item.variantId || "default"}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        const nextQty = existing.quantity + (item.quantity || 1);
        const max = item.maxStock ?? 99;
        if (nextQty > max) {
          toast.error(`Only ${max} pieces available in inventory.`);
          return prev;
        }
        return prev.map((i) => (i.id === id ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { ...item, id, quantity: item.quantity || 1 }];
    });

    toast.success(`"${item.name}" added to shopping bag`, {
      description: "Complimentary shipping included.",
    });
    setIsOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === itemId);
      if (target) {
        toast.info(`"${target.name}" removed from shopping bag`);
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const max = i.maxStock ?? 99;
          if (quantity > max) {
            toast.error(`Only ${max} pieces available in inventory.`);
            return i;
          }
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "REXTON10" || trimmed === "SWISS10" || trimmed === "WELCOME") {
      setCouponCode(trimmed);
      toast.success(`Coupon code ${trimmed} applied!`, {
        description: "10% privilege discount applied to your order.",
      });
      return true;
    }
    toast.error("Invalid privilege code", {
      description: "Try code 'REXTON10' for 10% privilege discount.",
    });
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    toast.info("Coupon code removed.");
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shipping,
        total,
        couponCode,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
