"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string | null; position: number }[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallbackImages = images.length > 0 ? images : [
    { id: "fallback", url: "/images/placeholder-watch.svg", alt: title, position: 0 }
  ];

  const currentImage = fallbackImages[selectedIndex] || fallbackImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7f6f3] border border-hairline group">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-background/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-hairline">
          <Shield className="size-3 text-gold" />
          <span>Sapphire Glass</span>
        </div>

        <div className="relative size-full p-8 md:p-12 transition-transform duration-700 ease-out group-hover:scale-105">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || title}
            fill
            priority
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Thumbnails row */}
      {fallbackImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {fallbackImages.map((img, idx) => (
            <button
              key={img.id + idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden bg-[#f7f6f3] border transition-all cursor-pointer",
                selectedIndex === idx
                  ? "border-gold ring-1 ring-gold shadow-xs"
                  : "border-hairline opacity-70 hover:opacity-100"
              )}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
