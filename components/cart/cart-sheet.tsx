"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShieldCheck, Plus, Minus, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/format";

export function CartSheet() {
  const { items, itemCount, subtotal, total, discount, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md bg-background border-l border-hairline"
      >
        {/* Header */}
        <SheetHeader className="border-b border-hairline px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-gold" />
              <SheetTitle className="font-display text-lg tracking-wider uppercase font-medium">
                Shopping Bag
              </SheetTitle>
              <span className="text-xs text-muted-foreground">({itemCount})</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              aria-label="Close cart"
            >
              <X className="size-5" />
            </button>
          </div>
        </SheetHeader>

        {/* Complimentary shipping banner */}
        <div className="bg-secondary/60 px-6 py-2.5 border-b border-hairline flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-foreground/80 font-medium">
            <ShieldCheck className="size-4 text-gold" />
            <span>Complimentary Insured Delivery Across India</span>
          </div>
        </div>

        {/* Items List / Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-hairline">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="size-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                <ShoppingBag className="size-7 stroke-[1.2]" />
              </div>
              <p className="font-display text-xl">Your bag is empty</p>
              <p className="mt-2 max-w-[260px] text-xs text-muted-foreground leading-relaxed">
                Discover our collection of precision-engineered Swiss-inspired timepieces.
              </p>
              <Button
                asChild
                className="mt-6 h-11 px-6 uppercase tracking-wider text-xs font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/shop">Explore Watches</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-start">
                {/* Watch image */}
                <Link
                  href={`/product/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="relative size-20 shrink-0 overflow-hidden bg-secondary border border-hairline"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain p-1 transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.collectionName && (
                        <p className="eyebrow text-[10px] text-gold">{item.collectionName}</p>
                      )}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-serif text-sm font-medium hover:text-gold transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground">{item.variantName}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-hairline bg-background">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xs font-medium font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <p className="text-[10px] text-muted-foreground line-through font-mono">
                          {formatPrice(item.compareAtPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-hairline p-6 bg-secondary/30 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold font-medium">
                  <span>Privilege Discount</span>
                  <span className="font-mono">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground uppercase tracking-wider text-[11px] font-medium">
                  Complimentary
                </span>
              </div>
              <div className="rule my-2" />
              <div className="flex justify-between text-sm font-medium text-foreground">
                <span className="font-display tracking-wider uppercase">Estimated Total</span>
                <span className="font-mono text-base">{formatPrice(total)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                All applicable taxes and insured door-to-door delivery included.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                asChild
                className="w-full h-12 uppercase tracking-widest text-xs font-medium group"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-11 uppercase tracking-widest text-xs font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/cart">View Shopping Bag</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
