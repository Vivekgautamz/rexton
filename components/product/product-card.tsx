"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    shortDescription: string;
    description?: string;
    movement?: string;
    dialColor?: string | null;
    caseDiameter?: string | null;
    strapMaterial?: string | null;
    waterResistance?: string | null;
    glassType?: string | null;
    stock: number;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    isLimitedEdition?: boolean;
    isFeatured?: boolean;
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    images: { url: string; alt?: string | null; position: number }[];
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const mainImage = product.images[0]?.url || "/images/placeholder-watch.svg";
  const hoverImage = product.images[1]?.url || mainImage;
  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      imageUrl: mainImage,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      collectionName: product.collection?.name,
      categoryName: product.category?.name,
      maxStock: product.stock,
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    });
  };

  return (
    <>
      <div className="group relative flex flex-col bg-background transition-all duration-300">
        {/* Image Stage */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7f6f3] border border-hairline">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
            {product.isLimitedEdition && (
              <span className="bg-ink text-paper text-[10px] uppercase font-mono px-2 py-0.5 tracking-widest">
                Limited
              </span>
            )}
            {product.isBestSeller && !product.isLimitedEdition && (
              <span className="bg-gold text-white text-[10px] uppercase font-mono px-2 py-0.5 tracking-widest">
                Best Seller
              </span>
            )}
            {product.isNewArrival && !product.isLimitedEdition && !product.isBestSeller && (
              <span className="bg-secondary text-foreground border border-hairline text-[10px] uppercase font-mono px-2 py-0.5 tracking-widest">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-destructive text-white text-[10px] uppercase font-mono px-1.5 py-0.5 tracking-wider">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-3 right-3 z-10 size-8 rounded-full flex items-center justify-center transition-all duration-200 border",
              isSaved
                ? "bg-gold text-white border-gold shadow-sm"
                : "bg-background/90 text-foreground/70 hover:text-foreground border-hairline hover:bg-background"
            )}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("size-4", isSaved && "fill-current")} />
          </button>

          {/* Product Image with Hover transition */}
          <Link href={`/product/${product.slug}`} className="block size-full p-6">
            <div className="relative size-full transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority={priority}
                className={cn(
                  "object-contain transition-opacity duration-500",
                  product.images[1] ? "group-hover:opacity-0" : ""
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {product.images[1] && (
                <Image
                  src={hoverImage}
                  alt={`${product.name} alternate angle`}
                  fill
                  className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </div>
          </Link>

          {/* Quick Action Overlay (Desktop) */}
          <div className="absolute inset-x-3 bottom-3 z-10 hidden md:flex items-center gap-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              className="flex-1 h-10 text-xs uppercase tracking-wider font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors"
            >
              {isAdding ? (
                <>
                  <Check className="size-3.5 mr-1" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="size-3.5 mr-1" /> Add to Bag
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuickViewOpen(true)}
              className="size-10 bg-background/95 hover:bg-background border-hairline text-foreground"
              title="Quick view"
              aria-label="Quick view"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col pt-4 pb-2 px-1">
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
            <span>{product.collection?.name || product.category?.name || "REXTON"}</span>
            {product.movement && (
              <span className="text-[10px]">{product.movement}</span>
            )}
          </div>

          <h3 className="mt-1 font-serif text-base font-normal tracking-wide text-foreground">
            <Link
              href={`/product/${product.slug}`}
              className="hover:text-gold transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </h3>

          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {product.shortDescription}
          </p>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-mono text-sm font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-mono text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add */}
          <div className="mt-3 block md:hidden">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="w-full h-9 text-xs uppercase tracking-wider font-medium border-hairline"
            >
              {isAdding ? (
                <>
                  <Check className="size-3.5 mr-1 text-gold" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="size-3.5 mr-1" /> Add to Bag
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewDialog
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
