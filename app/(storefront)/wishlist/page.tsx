"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { items, itemCount, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      imageUrl: item.imageUrl,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      quantity: 1,
      collectionName: item.collectionName,
      categoryName: item.categoryName,
    });
    removeFromWishlist(item.productId);
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-[70vh] flex items-center justify-center py-20">
        <div className="container-page max-w-md text-center">
          <div className="size-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-muted-foreground mb-6">
            <Heart className="size-8 stroke-[1.2]" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-foreground">
            Your Wishlist is Empty
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Keep track of timepieces you are considering.
            Click the heart icon on any watch to save it here for later.
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
          <p className="eyebrow text-gold text-xs">Saved Timepieces</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-foreground">
            Your Wishlist ({itemCount} {itemCount === 1 ? "Piece" : "Pieces"})
          </h1>
        </div>
      </section>

      {/* Grid of Saved Watches */}
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col border border-hairline bg-[#fbfaf8] justify-between overflow-hidden group"
            >
              {/* Image stage */}
              <div className="relative aspect-[4/5] w-full bg-[#f4f2ec] p-6 border-b border-hairline">
                <Link href={`/product/${item.slug}`} className="block size-full">
                  <div className="relative size-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>

                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 size-8 rounded-full bg-background/90 border border-hairline flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {/* Watch Details */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <p className="eyebrow text-[10px] text-gold">
                    {item.collectionName || item.categoryName || "REXTON"}
                  </p>
                  <h3 className="font-serif text-lg font-normal mt-1 line-clamp-1">
                    <Link
                      href={`/product/${item.slug}`}
                      className="hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-sm font-medium">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <span className="font-mono text-xs text-muted-foreground line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-hairline space-y-2">
                  <Button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full h-10 text-xs uppercase tracking-wider font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors"
                  >
                    <ShoppingBag className="size-3.5 mr-2" />
                    Move to Bag
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
