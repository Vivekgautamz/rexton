import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Search Timepieces · REXTON Watches",
  description: "Search the REXTON catalogue by collection, complication, dial or reference SKU.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ? q.trim() : "";

  const popularSearches = [
    "Chronograph",
    "Automatic",
    "Heritage 38",
    "Rose Gold",
    "Silver",
    "Onyx",
    "Limited Edition",
  ];

  let products: any[] = [];

  if (query) {
    products = await db.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query } },
          { shortDescription: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
          { tags: { contains: query } },
          { dialColor: { contains: query } },
          { strapMaterial: { contains: query } },
          { category: { name: { contains: query } } },
          { collection: { name: { contains: query } } },
        ],
      },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        collection: true,
      },
      orderBy: { isFeatured: "desc" },
    });
  }

  // Fallback recommended products if query is empty or 0 results
  const recommendations =
    products.length === 0
      ? await db.product.findMany({
          where: { isPublished: true, isBestSeller: true },
          include: {
            images: { orderBy: { position: "asc" } },
            category: true,
            collection: true,
          },
          take: 4,
        })
      : [];

  return (
    <div className="bg-background min-h-screen">
      {/* Search Header */}
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page max-w-3xl mx-auto text-center">
          <p className="eyebrow text-gold text-xs">Search Catalogue</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-normal">
            Find Your Timepiece
          </h1>

          {/* Search Form */}
          <form method="GET" action="/search" className="mt-8 relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-4 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by model, reference SKU, dial color, or movement..."
                className="w-full h-13 pl-11 pr-28 bg-background border border-hairline focus:border-gold outline-none text-xs sm:text-sm font-mono tracking-wide placeholder:text-muted-foreground text-foreground"
              />
              <Button
                type="submit"
                className="absolute right-1.5 h-10 px-5 text-xs uppercase tracking-wider font-medium"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Popular Search Suggestions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-muted-foreground text-[11px] font-mono">Suggested:</span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-2.5 py-1 bg-background border border-hairline text-muted-foreground hover:text-gold hover:border-gold transition-colors font-mono text-[11px]"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-page py-12 md:py-16">
        {query ? (
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-hairline mb-10">
              <h2 className="font-serif text-xl sm:text-2xl font-normal">
                Results for &ldquo;{query}&rdquo;
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {products.length} {products.length === 1 ? "match found" : "matches found"}
              </span>
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} columns={3} />
            ) : (
              <div className="py-16 text-center">
                <p className="font-serif text-2xl">No Timepieces Found</p>
                <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
                  We could not find any watches matching &ldquo;{query}&rdquo;.
                  Please try a different term, or explore our best-selling collections below.
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* If no query or no results, show curated recommendations */}
        {recommendations.length > 0 && (
          <div className={query ? "mt-20 pt-16 border-t border-hairline" : ""}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="eyebrow text-gold text-xs">Curated Selection</p>
                <h3 className="mt-1 font-serif text-2xl font-normal">
                  Popular Timepieces
                </h3>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs uppercase">
                <Link href="/shop">View All Watches</Link>
              </Button>
            </div>
            <ProductGrid products={recommendations} columns={4} />
          </div>
        )}
      </section>
    </div>
  );
}
