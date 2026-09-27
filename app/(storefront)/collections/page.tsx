import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Watch Collections · REXTON Watches",
  description:
    "Explore REXTON horological collections: Heritage, Atelier, Sport, and Limited Editions. Swiss-inspired discipline, engineered in India.",
};

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { isPublished: true } } },
      },
      products: {
        where: { isPublished: true },
        include: { images: true },
        take: 1,
      },
    },
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-hairline py-16 md:py-24 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Horological Portfolios</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-normal text-foreground">
            The REXTON Collections
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
            Every collection represents a dedicated study in proportion, complication, and finishing.
            From timeless everyday dress pieces to column-wheel chronographs and numbered limited runs.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="container-page py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((col, idx) => {
            const previewWatch = col.products[0];
            const watchCount = col._count.products;

            return (
              <div
                key={col.id}
                className="group relative flex flex-col justify-between border border-hairline bg-[#fbfaf8] hover:border-gold/60 transition-all duration-300 overflow-hidden"
              >
                {/* Visual Preview */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f4f2ec] border-b border-hairline flex items-center justify-center p-8">
                  <div className="relative size-48 transition-transform duration-700 ease-out group-hover:scale-105">
                    <Image
                      src={
                        previewWatch?.images[0]?.url ||
                        "/images/placeholder-watch.svg"
                      }
                      alt={col.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <span className="absolute top-4 left-4 font-mono text-xs text-gold">
                    SERIES 0{idx + 1}
                  </span>
                  <span className="absolute top-4 right-4 eyebrow text-[10px] text-muted-foreground">
                    {watchCount} {watchCount === 1 ? "Piece" : "Pieces"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground group-hover:text-gold transition-colors">
                      {col.name} Collection
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed font-light">
                      {col.description ||
                        "Swiss-inspired horological engineering crafted with 316L steel and sapphire crystal."}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between">
                    <Link
                      href={`/collections/${col.slug}`}
                      className="eyebrow text-xs text-foreground group-hover:text-gold flex items-center gap-2 transition-colors uppercase tracking-widest font-mono"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
