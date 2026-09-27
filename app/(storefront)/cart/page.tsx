"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Heart, ArrowRight, ShieldCheck, ShoppingBag, Plus, Minus, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    couponCode,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput("");
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    toggleWishlist({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      imageUrl: item.imageUrl,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      collectionName: item.collectionName,
      categoryName: item.categoryName,
    });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-[70vh] flex items-center justify-center py-20">
        <div className="container-page max-w-md text-center">
          <div className="size-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-muted-foreground mb-6">
            <ShoppingBag className="size-8 stroke-[1.2]" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-foreground">
            Your Shopping Bag is Empty
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Your shopping bag does not contain any timepieces yet.
            Explore our Swiss-inspired collection and find your signature watch.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="h-12 px-8 uppercase tracking-widest text-xs">
              <Link href="/shop">Discover Watches</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-b border-hairline py-10 bg-[#faf9f6]">
        <div className="container-page">
          <p className="eyebrow text-gold text-xs">Checkout Bag</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-foreground">
            Shopping Bag ({itemCount} {itemCount === 1 ? "Piece" : "Pieces"})
          </h1>
        </div>
      </section>

      {/* Main Cart Body */}
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: Cart Items List */}
          <div className="divide-y divide-hairline border-t border-b border-hairline">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Watch image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative size-24 sm:size-28 shrink-0 overflow-hidden bg-[#f7f6f3] border border-hairline"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      {item.collectionName && (
                        <p className="eyebrow text-[10px] text-gold">{item.collectionName}</p>
                      )}
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-serif text-lg font-normal hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        REF: {item.sku}
                      </p>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Option: {item.variantName}
                        </p>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="text-right">
                      <p className="font-mono text-base font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-hairline/60">
                    <div className="flex items-center border border-hairline bg-background">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-10 text-center font-mono text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="size-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors font-mono text-[11px]"
                      >
                        <Heart className="size-3.5" />
                        <span>Move to Wishlist</span>
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors font-mono text-[11px]"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary Card */}
          <div className="p-8 bg-[#fbfaf8] border border-hairline space-y-6 lg:sticky lg:top-28">
            <h2 className="font-serif text-xl font-normal border-b border-hairline pb-4">
              Order Summary
            </h2>

            {/* Price lines */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} pieces)</span>
                <span className="font-mono text-foreground font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-gold font-medium">
                  <span>Privilege Savings ({couponCode})</span>
                  <span className="font-mono">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Insured Door-to-Door Delivery</span>
                <span className="text-foreground uppercase tracking-wider text-[11px] font-mono font-medium">
                  Complimentary
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated GST / Taxes</span>
                <span className="text-muted-foreground font-mono">Included</span>
              </div>

              <div className="rule my-3" />

              <div className="flex justify-between text-base font-medium">
                <span className="font-serif">Total Payable</span>
                <span className="font-mono text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-2">
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-secondary/80 border border-gold/40 text-xs">
                  <div className="flex items-center gap-2 text-gold font-mono">
                    <Tag className="size-3.5" />
                    <span>Coupon &ldquo;{couponCode}&rdquo; active</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-muted-foreground hover:text-destructive underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Privilege Code (e.g. REXTON10)"
                    className="flex-1 h-10 px-3 bg-background border border-hairline text-xs font-mono uppercase tracking-wide focus:border-gold outline-none"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-10 px-4 text-xs uppercase tracking-wider border-hairline"
                  >
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Checkout & Continue Actions */}
            <div className="space-y-3 pt-2">
              <Button
                asChild
                className="w-full h-13 uppercase tracking-widest text-xs font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors group"
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full h-10 uppercase tracking-widest text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>

            {/* Reassurance */}
            <div className="pt-4 border-t border-hairline flex items-center gap-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-gold shrink-0" />
              <span>Complimentary insured shipping & 2-year manufacturer warranty.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
