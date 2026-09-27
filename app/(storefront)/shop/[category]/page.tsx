import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Prisma } from "@/lib/generated/prisma/client";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    movement?: string;
    gender?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await db.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Category Not Found · REXTON Watches" };
  }

  return {
    title: `${category.name} Watches · REXTON Watches`,
    description: category.description || `Discover REXTON ${category.name} watches.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const filterParams = await searchParams;

  const category = await db.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const movement = filterParams.movement;
  const gender = filterParams.gender;
  const sort = filterParams.sort || "featured";
  const inStockOnly = filterParams.inStock === "true";

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    categoryId: category.id,
  };

  if (movement) {
    where.movement = movement as any;
  }

  if (gender) {
    where.gender = gender as any;
  }

  if (inStockOnly) {
    where.stock = { gt: 0 };
  }

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
    orderBy = { isFeatured: "desc" };
  }

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

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-hairline py-12 md:py-16 bg-[#faf9f6]">
        <div className="container-page">
          <p className="eyebrow text-gold text-xs">Category</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            {category.name} Timepieces
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground font-light">
            {category.description ||
              "Engineered with Swiss horological precision and 316L surgical-grade steel."}
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
            <div className="flex items-center justify-between pb-6 border-b border-hairline mb-8">
              <span className="font-mono text-xs text-muted-foreground">
                Showing {products.length} {products.length === 1 ? "piece" : "pieces"}
              </span>
              <ProductSort />
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} columns={3} />
            ) : (
              <div className="py-20 text-center border border-dashed border-hairline p-8">
                <p className="font-serif text-2xl">No {category.name} Watches Found</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Try clearing movement or stock filters to view available pieces.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
