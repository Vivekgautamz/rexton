import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await db.collection.findUnique({
    where: { slug },
  });

  if (!collection) {
    return { title: "Collection Not Found · REXTON Watches" };
  }

  return {
    title: `${collection.name} Collection · REXTON Watches`,
    description:
      collection.description ||
      `Discover timepieces in the REXTON ${collection.name} collection.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;

  const collection = await db.collection.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          collection: true,
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page max-w-4xl">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-3.5" />
            <span>All Collections</span>
          </Link>

          <p className="eyebrow text-gold text-xs">REXTON Portfolio</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            The {collection.name} Collection
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground font-light">
            {collection.description ||
              "Each watch in this collection is regulated across five positions, equipped with anti-reflective sapphire crystal, and enclosed in high-grade 316L stainless steel."}
          </p>

          <div className="mt-8 flex items-center gap-6 pt-6 border-t border-hairline text-xs font-mono text-muted-foreground">
            <span>{collection.products.length} Timepieces Available</span>
            <span>·</span>
            <span>Complimentary Insured Shipping</span>
            <span>·</span>
            <span>2-Year International Warranty</span>
          </div>
        </div>
      </section>

      {/* Watches Grid */}
      <section className="container-page py-14 md:py-20">
        {collection.products.length > 0 ? (
          <ProductGrid products={collection.products} columns={3} />
        ) : (
          <div className="py-20 text-center border border-dashed border-hairline p-8">
            <p className="font-serif text-2xl">No Watches In This Collection Yet</p>
            <p className="mt-2 text-xs text-muted-foreground">
              New models are currently undergoing final regulation in the workshop.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
