"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface FilterOptions {
  categories: { id: string; name: string; slug: string }[];
  collections: { id: string; name: string; slug: string }[];
}

interface ProductFiltersProps {
  options: FilterOptions;
  totalProducts: number;
}

export function ProductFilters({ options, totalProducts }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category");
  const currentCollection = searchParams.get("collection");
  const currentMovement = searchParams.get("movement");
  const currentGender = searchParams.get("gender");
  const currentSort = searchParams.get("sort") || "featured";
  const inStockOnly = searchParams.get("inStock") === "true";

  const movements = ["AUTOMATIC", "QUARTZ", "MECHANICAL", "SKELETON"];
  const genders = [
    { label: "Unisex", value: "UNISEX" },
    { label: "Men", value: "MEN" },
    { label: "Women", value: "WOMEN" },
  ];

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page when filters change
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentCollection ||
      currentMovement ||
      currentGender ||
      inStockOnly
  );

  const FilterContent = () => (
    <div className="space-y-8 text-xs">
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <span className="font-mono text-muted-foreground uppercase text-[11px]">
            Filters Active
          </span>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-gold hover:text-foreground transition-colors font-mono text-[11px]"
          >
            <RotateCcw className="size-3" />
            <span>Reset all</span>
          </button>
        </div>
      )}

      {/* Category filter */}
      <div>
        <h4 className="eyebrow text-foreground mb-3 text-[11px]">Category</h4>
        <div className="space-y-2">
          {options.categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => updateParam("category", isSelected ? null : cat.slug)}
                className={`w-full text-left py-1 px-2 rounded-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-secondary text-gold font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <span className="size-1.5 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection filter */}
      <div>
        <h4 className="eyebrow text-foreground mb-3 text-[11px]">Collection</h4>
        <div className="space-y-2">
          {options.collections.map((col) => {
            const isSelected = currentCollection === col.slug;
            return (
              <button
                key={col.id}
                onClick={() => updateParam("collection", isSelected ? null : col.slug)}
                className={`w-full text-left py-1 px-2 rounded-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-secondary text-gold font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <span>{col.name}</span>
                {isSelected && <span className="size-1.5 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movement filter */}
      <div>
        <h4 className="eyebrow text-foreground mb-3 text-[11px]">Movement</h4>
        <div className="flex flex-wrap gap-1.5">
          {movements.map((m) => {
            const isSelected = currentMovement === m;
            return (
              <button
                key={m}
                onClick={() => updateParam("movement", isSelected ? null : m)}
                className={`px-2.5 py-1 text-[11px] font-mono border transition-all ${
                  isSelected
                    ? "border-ink bg-ink text-paper"
                    : "border-hairline text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender filter */}
      <div>
        <h4 className="eyebrow text-foreground mb-3 text-[11px]">Gender</h4>
        <div className="flex flex-wrap gap-1.5">
          {genders.map((g) => {
            const isSelected = currentGender === g.value;
            return (
              <button
                key={g.value}
                onClick={() => updateParam("gender", isSelected ? null : g.value)}
                className={`px-2.5 py-1 text-[11px] font-mono border transition-all ${
                  isSelected
                    ? "border-ink bg-ink text-paper"
                    : "border-hairline text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t border-hairline">
        <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="size-3.5 accent-gold cursor-pointer"
          />
          <span className="text-xs">In stock only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-hairline">
        <div className="sticky top-28 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="eyebrow text-foreground text-xs">Filter Timepieces</h3>
            <span className="font-mono text-xs text-muted-foreground">
              {totalProducts} {totalProducts === 1 ? "piece" : "pieces"}
            </span>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Drawer Filter Trigger */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-hairline mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 border-hairline text-xs uppercase tracking-wider font-medium"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Filter ({hasActiveFilters ? "Active" : "All"})</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full sm:max-w-xs p-6 bg-background border-r border-hairline overflow-y-auto"
          >
            <SheetHeader className="pb-4 border-b border-hairline text-left">
              <SheetTitle className="font-display text-base uppercase tracking-wider">
                Filter Timepieces
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        <span className="font-mono text-xs text-muted-foreground">
          {totalProducts} {totalProducts === 1 ? "piece" : "pieces"}
        </span>
      </div>
    </>
  );
}
