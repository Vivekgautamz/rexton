"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Heart, ShieldCheck, Check, Clock, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  name: string;
  sku: string;
  price?: number | null;
  options?: string;
  imageUrl?: string | null;
}

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    lowStockThreshold: number;
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    movement?: string;
    images: { url: string; alt?: string | null }[];
    variants?: Variant[];
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const { addItem, setIsOpen: setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const currentPrice = product.price;
  const mainImage = product.images[0]?.url || "/images/placeholder-watch.svg";

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdded(true);
    addItem({
      productId: product.id,
      variantId: selectedVariantId,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      imageUrl: mainImage,
      price: currentPrice,
      compareAtPrice: product.compareAtPrice,
      quantity,
      collectionName: product.collection?.name,
      categoryName: product.category?.name,
      maxStock: product.stock,
    });
    setTimeout(() => setIsAdded(false), 800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariantId,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      imageUrl: mainImage,
      price: currentPrice,
      compareAtPrice: product.compareAtPrice,
      quantity,
      collectionName: product.collection?.name,
      categoryName: product.category?.name,
      maxStock: product.stock,
    });
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Variant Selection if available */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="eyebrow text-xs text-foreground block">
            Select Configuration
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono border transition-all cursor-pointer",
                    isSelected
                      ? "border-ink bg-ink text-paper"
                      : "border-hairline text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock status indicator */}
      <div className="flex items-center gap-2 text-xs">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 text-destructive font-medium">
            <span className="size-2 rounded-full bg-destructive" />
            Currently Sold Out — Join Waitlist
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            Only {product.stock} pieces remaining in current production batch
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="size-2 rounded-full bg-emerald-600" />
            In Stock — Regulated & Ready to Ship
          </span>
        )}
      </div>

      {/* Quantity & Add to Cart row */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {/* Quantity selector */}
          <div className="flex items-center border border-hairline bg-background">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              className="size-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center font-mono text-sm font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={isOutOfStock || quantity >= product.stock}
              className="size-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Bag Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 h-12 text-xs uppercase tracking-widest font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors"
          >
            {isAdded ? (
              <>
                <Check className="size-4 mr-2" /> Added to Bag
              </>
            ) : isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingBag className="size-4 mr-2" /> Add to Shopping Bag
              </>
            )}
          </Button>

          {/* Wishlist Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              toggleWishlist({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                imageUrl: mainImage,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                collectionName: product.collection?.name,
                categoryName: product.category?.name,
                movement: product.movement,
              })
            }
            className={cn(
              "size-12 border-hairline transition-colors",
              isSaved ? "bg-gold text-white border-gold" : "hover:text-gold"
            )}
            title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label="Wishlist"
          >
            <Heart className={cn("size-4", isSaved && "fill-current")} />
          </Button>
        </div>

        {/* Buy Now instant checkout */}
        {!isOutOfStock && (
          <Button
            onClick={handleBuyNow}
            variant="outline"
            className="w-full h-12 text-xs uppercase tracking-widest font-medium border-ink hover:bg-secondary transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <span>Instant Checkout</span>
              <ArrowRight className="size-3.5" />
            </span>
          </Button>
        )}
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="pt-4 border-t border-hairline space-y-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <Truck className="size-4 text-gold shrink-0" />
          <span>Complimentary insured shipping across India (2–4 business days)</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-gold shrink-0" />
          <span>2-Year International Warranty on movement and internal components</span>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw className="size-4 text-gold shrink-0" />
          <span>14-day hassle-free inspection and return period</span>
        </div>
      </div>
    </div>
  );
}
