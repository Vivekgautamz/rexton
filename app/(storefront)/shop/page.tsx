import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/lib/generated/prisma/client";

export const metadata: Metadata = {
  title: "All Watches · The REXTON Catalogue",
  description:
    "Explore the complete REXTON watch collection. Automatic, Chronograph, and Limited Edition Swiss-inspired timepieces crafted for precision.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    movement?: string;
    gender?: string;
    sort?: string;
    inStock?: string;
    q?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const collectionSlug = params.collection;
  const movement = params.movement;
  const gender = params.gender;
  const sort = params.sort || "featured";
  const inStockOnly = params.inStock === "true";
  const query = params.q;

  // Build Prisma where query
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (collectionSlug) {
    where.collection = { slug: collectionSlug };
  }

  if (movement) {
    where.movement = movement as any;
  }

  if (gender) {
    where.gender = gender as any;
  }

  if (inStockOnly) {
    where.stock = { gt: 0 };
  }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
      { sku: { contains: query } },
      { tags: { contains: query } },
    ];
  }

  // Determine sort order
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "bestseller") {
    orderBy = { isBestSeller: "desc" };
  } else {
    // featured
    orderBy = { isFeatured: "desc" };
  }

  // Fetch products and filter categories/collections
  const [products, categories, collections] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        collection: true,
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const activeCollection = collections.find((c) => c.slug === collectionSlug);

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-hairline py-12 md:py-16 bg-[#faf9f6]">
        <div className="container-page">
          <p className="eyebrow text-gold text-xs">The REXTON Catalogue</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            {activeCategory?.name || activeCollection?.name || "All Timepieces"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground font-light">
            {activeCategory
              ? `Precision engineered ${activeCategory.name.toLowerCase()} timepieces built with surgical steel and scratch-resistant sapphire crystals.`
              : activeCollection
              ? `The ${activeCollection.name} collection — Swiss-inspired horology with exacting tolerances and timeless aesthetics.`
              : "Discover our complete range of chronographs, automatics, and classic dress watches regulated across 5 positions."}
          </p>
        </div>
      </section>

      {/* Main Catalog Stage */}
      <div className="container-page py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <ProductFilters
            options={{ categories, collections }}
            totalProducts={products.length}
          />

          {/* Product Listing Area */}
          <main className="flex-1">
            {/* Top Toolbar (Sort & Count) */}
            <div className="flex items-center justify-between pb-6 border-b border-hairline mb-8">
              <span className="font-mono text-xs text-muted-foreground">
                Showing {products.length} {products.length === 1 ? "timepiece" : "timepieces"}
              </span>
              <ProductSort />
            </div>

            {/* Product Grid or Empty State */}
            {products.length > 0 ? (
              <ProductGrid products={products} columns={3} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-hairline p-8">
                <p className="font-serif text-2xl text-foreground">No Timepieces Found</p>
                <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
                  No watches match the specific configuration or filters selected.
                  Try adjusting or clearing your active filters to see all available timepieces.
                </p>
                <Button asChild className="mt-6 h-10 px-6 text-xs uppercase tracking-wider">
                  <Link href="/shop">Clear All Filters</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
