import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Award, Sparkles, Clock, Compass, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "REXTON Watches — Swiss Timeless Root | Luxury Timepieces",
  description:
    "Swiss-inspired precision. Crafted for those who value every second. Discover REXTON chronographs, automatics and limited editions with complimentary shipping across India.",
};

export default async function HomePage() {
  // Fetch real database records
  const [bestSellers, newArrivals, categories, collections] = await Promise.all([
    db.product.findMany({
      where: { isPublished: true, isBestSeller: true },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        collection: true,
      },
      take: 4,
    }),
    db.product.findMany({
      where: { isPublished: true, isNewArrival: true },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        collection: true,
      },
      take: 4,
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 5,
    }),
    db.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
  ]);

  // Featured spotlight product
  const spotlight = bestSellers[0] || (await db.product.findFirst({
    where: { isPublished: true },
    include: { images: true, category: true, collection: true },
  }));

  const customerReviews = [
    {
      name: "Vikramaditya S.",
      city: "New Delhi",
      rating: 5,
      watch: "Heritage 38 · Automatic",
      quote:
        "The case finishing is easily on par with watches costing thrice as much. The brushed bevels catch the light with incredible subtlety. A true masterpiece.",
    },
    {
      name: "Dr. Rohini K.",
      city: "Mumbai",
      rating: 5,
      watch: "Chronograph No. 7 · Onyx",
      quote:
        "Weight, balance, and the tactile click of the chronograph pushers are sublime. It has become my everyday timepiece for both the clinic and evening galas.",
    },
    {
      name: "Arjun Nambiar",
      city: "Bengaluru",
      rating: 5,
      watch: "Atelier Rose Gold",
      quote:
        "Packaging, documentation, and the presentation box feel truly regal. Arrived in Bangalore in 48 hours in pristine condition.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ── 1. Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-hairline bg-gradient-to-b from-[#fbfaf8] via-background to-background">
        <div className="container-page flex flex-col justify-center py-16 md:py-24 lg:py-28 min-h-[82vh]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-12 lg:gap-8">
            {/* Left Headline & Action */}
            <div className="flex flex-col items-start z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-hairline bg-background text-[11px] font-mono uppercase tracking-widest text-gold mb-6">
                <Sparkles className="size-3 text-gold" />
                <span>Swiss Timeless Root · 2026 Collection</span>
              </div>

              <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-tight font-normal text-foreground">
                TIMELESS <br />
                <span className="italic font-light">BY DESIGN.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-muted-foreground font-light">
                Swiss-inspired precision, assembled with uncompromising discipline.
                Crafted for those who value every second and refuse to wear the ordinary.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-13 px-8 text-xs uppercase tracking-widest font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors"
                >
                  <Link href="/shop" className="flex items-center gap-2">
                    <span>Shop Watches</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-xs uppercase tracking-widest font-medium border-hairline hover:border-foreground transition-colors"
                >
                  <Link href="/collections">Explore Collections</Link>
                </Button>
              </div>

              {/* Horology credentials bar */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-hairline w-full">
                <div>
                  <p className="eyebrow text-gold text-[10px]">Movement</p>
                  <p className="mt-1 font-mono text-xs text-foreground">5-Position Regulated</p>
                </div>
                <div>
                  <p className="eyebrow text-gold text-[10px]">Casing</p>
                  <p className="mt-1 font-mono text-xs text-foreground">316L Surgical Steel</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="eyebrow text-gold text-[10px]">Delivery</p>
                  <p className="mt-1 font-mono text-xs text-foreground">Insured India-Wide</p>
                </div>
              </div>
            </div>

            {/* Right Watch Hero Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative size-80 sm:size-96 lg:size-[30rem] rounded-full bg-radial from-[#e9e7e1] via-[#f4f2ec] to-transparent flex items-center justify-center p-8">
                <div className="relative size-full animate-in fade-in zoom-in-95 duration-1000">
                  <Image
                    src={spotlight?.images[0]?.url || "/images/placeholder-watch.svg"}
                    alt="REXTON Luxury Timepiece"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              {/* Floating feature badge */}
              <div className="absolute bottom-4 left-4 sm:left-12 bg-background/95 backdrop-blur-md border border-hairline p-4 max-w-[200px] shadow-sm">
                <p className="eyebrow text-[9px] text-gold">Featured Model</p>
                <p className="font-serif text-sm font-medium mt-1">{spotlight?.name}</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  {spotlight?.price ? formatPrice(spotlight.price) : "₹18,900"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Navigation Cards ────────────────────── */}
      <section className="border-b border-hairline bg-background py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow text-gold">The Range</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal">
                Curated Categories
              </h2>
            </div>
            <Link
              href="/shop"
              className="eyebrow text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors link-underline pb-1 self-start md:self-auto"
            >
              <span>View All Timepieces</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="group relative flex flex-col justify-between p-6 bg-[#f7f6f3] border border-hairline hover:border-gold/50 transition-all duration-300 min-h-[180px]"
              >
                <div>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{cat.sortOrder}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl mt-2 font-normal group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-foreground/80 group-hover:text-gold transition-colors">
                  <span>Explore category</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Best Sellers Carousel / Grid ─────────────────── */}
      <section className="border-b border-hairline bg-background py-20 lg:py-24">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow text-gold">Most Coveted</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop?sort=bestseller"
              className="eyebrow text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors link-underline pb-1"
            >
              <span>Explore Top Pieces</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Brand Heritage & Swiss Root Story ────────────── */}
      <section className="border-b border-hairline bg-[#f9f8f5] py-20 lg:py-28">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="eyebrow text-gold">Our Philosophy</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-5xl leading-tight font-normal">
              Rooted in Swiss discipline.
              <br />
              <span className="italic font-light">Engineered for India.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground font-light">
              REXTON was founded on a singular commitment: a fine timepiece should never be an ephemeral fashion statement, but a precision heirloom that matures gracefully through decades of wear.
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground font-light">
              We uphold the horological traditions that made Swiss watchmaking the global benchmark — relentless tolerances, hand-finished surfaces, and rigorous testing — bringing this level of peerless manufacturing to watch enthusiasts across India.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-hairline">
              <div>
                <span className="font-serif text-3xl text-foreground">316L</span>
                <p className="eyebrow text-gold mt-1 text-[10px]">Austenitic Steel</p>
                <p className="text-xs text-muted-foreground mt-1">High corrosion resistance, hypoallergenic comfort.</p>
              </div>
              <div>
                <span className="font-serif text-3xl text-foreground">9 Mohs</span>
                <p className="eyebrow text-gold mt-1 text-[10px]">Sapphire Crystal</p>
                <p className="text-xs text-muted-foreground mt-1">Impervious to everyday scratches and abrasions.</p>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild variant="outline" className="h-11 px-6 uppercase tracking-wider text-xs border-ink">
                <Link href="/about">Read The REXTON Story</Link>
              </Button>
            </div>
          </div>

          {/* Editorial Visual */}
          <div className="relative aspect-square sm:aspect-[4/3] bg-background border border-hairline p-8 flex flex-col justify-between overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#dedcd4_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="relative z-10 flex justify-between items-start">
              <span className="eyebrow text-[10px] text-gold">Horology Standards</span>
              <span className="font-mono text-[10px] text-muted-foreground">CH-IN CAL. 2026</span>
            </div>
            <div className="relative z-10 size-64 mx-auto my-auto transition-transform duration-700 group-hover:scale-105">
              <Image
                src="/images/products/watch-champagne.svg"
                alt="Horology Craftsmanship"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative z-10 border-t border-hairline pt-3 flex justify-between text-xs text-muted-foreground font-mono">
              <span>Regulation: 5 Positions</span>
              <span>Tolerance: ±4 sec/day</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. New Arrivals Showcase ────────────────────────── */}
      <section className="border-b border-hairline bg-background py-20 lg:py-24">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow text-gold">Latest Release</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?sort=newest"
              className="eyebrow text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors link-underline pb-1"
            >
              <span>View All Releases</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Collections Showcase Cards ───────────────────── */}
      <section className="border-b border-hairline bg-[#fdfdfc] py-20 lg:py-24">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow text-gold">The Collections</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal">
              Distinct Horological Identities
            </h2>
            <p className="mt-3 text-sm text-muted-foreground font-light">
              From pure dress elegance to column-wheel chronographs and numbered limited editions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col, idx) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative flex flex-col justify-between p-8 bg-[#f7f6f3] border border-hairline hover:border-gold transition-all duration-300 overflow-hidden min-h-[260px]"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gold">SERIES 0{idx + 1}</span>
                    <span className="eyebrow text-[10px] text-muted-foreground">In Stock</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl mt-4 font-normal group-hover:text-gold transition-colors">
                    {col.name} Collection
                  </h3>
                  <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foreground group-hover:text-gold transition-colors">
                  <span>Explore {col.name} watches</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Why REXTON Pillars ───────────────────────────── */}
      <section className="border-b border-hairline bg-background py-16 lg:py-20">
        <div className="container-page">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-start p-6 border border-hairline bg-[#fbfaf8]">
              <Clock className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-lg font-normal">Chronometric Precision</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Regulated movements calibrated for exceptional timekeeping accuracy and long-term durability.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 border border-hairline bg-[#fbfaf8]">
              <Award className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-lg font-normal">Noble Materials</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Surgical 316L stainless steel, anti-reflective sapphire crystals, and premium vegetable-tanned leather.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 border border-hairline bg-[#fbfaf8]">
              <ShieldCheck className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-lg font-normal">2-Year Warranty</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Full manufacturer coverage against mechanical and quartz internal movement defects with concierge support.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 border border-hairline bg-[#fbfaf8]">
              <Compass className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-lg font-normal">Complimentary Delivery</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Dispatched in secure tamper-proof presentation boxes with door-to-door insurance coverage across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Customer Testimonials ────────────────────────── */}
      <section className="border-b border-hairline bg-[#f9f8f5] py-20 lg:py-24">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="eyebrow text-gold">Owner Testimonials</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal">
              Words From The Collectors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerReviews.map((rev) => (
              <div
                key={rev.name}
                className="flex flex-col justify-between p-8 bg-background border border-hairline"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-foreground/80 italic font-serif">
                    &ldquo;{rev.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-8 pt-4 border-t border-hairline flex justify-between items-end text-xs">
                  <div>
                    <p className="font-medium text-foreground">{rev.name}</p>
                    <p className="text-muted-foreground text-[11px]">{rev.city}</p>
                  </div>
                  <div className="text-right">
                    <span className="eyebrow text-[9px] text-gold">{rev.watch}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
