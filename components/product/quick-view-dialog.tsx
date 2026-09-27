"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Check, ShieldCheck, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";

interface QuickViewDialogProps {
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
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    images: { url: string; alt?: string | null; position: number }[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: QuickViewDialogProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const mainImage =
    product.images[selectedImage]?.url ||
    product.images[0]?.url ||
    "/images/placeholder-watch.svg";
  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAddToCart = () => {
    setIsAdded(true);
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      imageUrl: mainImage,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity,
      collectionName: product.collection?.name,
      categoryName: product.category?.name,
      maxStock: product.stock,
    });
    setTimeout(() => {
      setIsAdded(false);
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 bg-background border border-hairline sm:rounded-none">
        <div className="grid md:grid-cols-2">
          {/* Left: Product Image Stage */}
          <div className="relative flex flex-col justify-between bg-[#f7f6f3] p-8 border-b md:border-b-0 md:border-r border-hairline">
            <div className="relative aspect-square w-full">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail switcher if multiple images exist */}
            {product.images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`size-12 relative border overflow-hidden bg-white transition-all ${
                      selectedImage === idx
                        ? "border-gold ring-1 ring-gold"
                        : "border-hairline opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col p-6 md:p-8 justify-between">
            <div>
              <DialogHeader className="p-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-gold text-xs">
                    {product.collection?.name || product.category?.name || "REXTON"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">
                    SKU: {product.sku}
                  </span>
                </div>
                <DialogTitle className="mt-2 font-serif text-2xl font-normal tracking-wide">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-xl font-medium">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="font-mono text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-destructive text-white text-[10px] uppercase font-mono px-1.5 py-0.5 tracking-wider">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              {/* Horological Highlights */}
              <div className="mt-5 grid grid-cols-2 gap-2 border-y border-hairline py-3 text-xs">
                {product.movement && (
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block font-mono">
                      Movement
                    </span>
                    <span className="font-medium text-foreground">{product.movement}</span>
                  </div>
                )}
                {product.caseDiameter && (
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block font-mono">
                      Diameter
                    </span>
                    <span className="font-medium text-foreground">{product.caseDiameter}</span>
                  </div>
                )}
                {product.waterResistance && (
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block font-mono">
                      Water Resistance
                    </span>
                    <span className="font-medium text-foreground">{product.waterResistance}</span>
                  </div>
                )}
                {product.glassType && (
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase block font-mono">
                      Crystal
                    </span>
                    <span className="font-medium text-foreground">{product.glassType}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-gold shrink-0" />
                <span>Complimentary Shipping & 2-Year International Warranty</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 text-xs uppercase tracking-wider font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors"
                >
                  {isAdded ? (
                    <>
                      <Check className="size-4 mr-2" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-4 mr-2" /> Add to Bag
                    </>
                  )}
                </Button>

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
                  className={`size-12 border-hairline ${
                    isSaved ? "bg-gold text-white border-gold" : ""
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span>View Complete Horological Specifications</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
