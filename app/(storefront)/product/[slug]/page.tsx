import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ShieldCheck, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductSpecsAccordion } from "@/components/product/product-specs-accordion";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice, discountPercent, formatDate } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  });

  if (!product) {
    return { title: "Timepiece Not Found · REXTON Watches" };
  }

  const imageUrl = product.images[0]?.url || "/images/placeholder-watch.svg";

  return {
    title: `${product.name} · REXTON Watches`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} · REXTON Watches`,
      description: product.shortDescription,
      images: [{ url: imageUrl, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      collection: true,
      variants: { where: { isActive: true } },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Related products
  const relatedProducts = await db.product.findMany({
    where: {
      isPublished: true,
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId },
        { collectionId: product.collectionId },
      ],
    },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      collection: true,
    },
    take: 4,
  });

  const discount = discountPercent(product.price, product.compareAtPrice);
  const totalReviews = product.reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "5.0";

  // Structured Data (JSON-LD Product Schema)
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "REXTON",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price / 100,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "REXTON Watches",
      },
    },
  };

  return (
    <>
      {/* JSON-LD Product Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="bg-background min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-hairline py-3 bg-[#faf9f6]">
          <div className="container-page flex items-center gap-2 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-hairline" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Watches
            </Link>
            {product.category && (
              <>
                <ChevronRight className="size-3 text-hairline" />
                <Link
                  href={`/shop/${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="size-3 text-hairline" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>

        {/* Product Hero Section */}
        <section className="container-page py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
            {/* Left: Gallery */}
            <div className="lg:sticky lg:top-28">
              <ProductGallery images={product.images} title={product.name} />
            </div>

            {/* Right: Purchase Info & Customization */}
            <div className="flex flex-col">
              {/* Category & SKU */}
              <div className="flex items-center justify-between gap-4 text-xs font-mono">
                <span className="eyebrow text-gold text-[11px]">
                  {product.collection?.name || product.category?.name} Collection
                </span>
                <span className="text-muted-foreground uppercase">
                  REF: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground tracking-tight">
                {product.name}
              </h1>

              {/* Ratings Summary */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < Math.round(Number(averageRating))
                          ? "fill-current"
                          : "text-muted"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 font-mono font-medium text-foreground">
                    {averageRating}
                  </span>
                </div>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground underline cursor-pointer">
                  {totalReviews > 0 ? `${totalReviews} Verified Reviews` : "New Horological Release"}
                </span>
              </div>

              {/* Price & Discount */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-mono text-2xl sm:text-3xl font-medium text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="font-mono text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-destructive text-white text-xs uppercase font-mono px-2 py-0.5 tracking-wider">
                    Privilege Savings -{discount}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                Inclusive of all taxes & complimentary insured courier delivery
              </p>

              {/* Short Narrative */}
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground font-light">
                {product.shortDescription}
              </p>

              {/* Interactive Purchase Actions */}
              <ProductActions product={product} />

              {/* Specifications & Horological Accordions */}
              <ProductSpecsAccordion product={product} />
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="border-t border-hairline py-16 md:py-24 bg-[#faf9f6]">
          <div className="container-page max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-hairline">
              <div>
                <p className="eyebrow text-gold text-xs">Owner Feedback</p>
                <h2 className="mt-2 font-serif text-3xl font-normal">
                  Verified Owner Reviews
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-sm font-medium">
                  {averageRating} out of 5.0
                </span>
              </div>
            </div>

            {product.reviews.length > 0 ? (
              <div className="mt-8 divide-y divide-hairline">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="py-6 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground font-serif text-sm">
                          {rev.user?.name || "Verified Collector"}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                            <CheckCircle2 className="size-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {formatDate(rev.createdAt, "short")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="size-3.5 fill-current" />
                      ))}
                    </div>

                    <h4 className="font-serif text-base font-normal pt-1">{rev.title}</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground font-light">
                      {rev.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <p className="font-serif text-lg text-foreground mb-1">
                  Be the first to review this timepiece
                </p>
                <p>All owners can submit a verified review through their customer portal.</p>
              </div>
            )}
          </div>
        </section>

        {/* "You May Also Like" / Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-hairline py-16 md:py-24 bg-background">
            <div className="container-page">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="eyebrow text-gold text-xs">Complementary Timepieces</p>
                  <h2 className="mt-2 font-serif text-3xl font-normal">
                    You May Also Appreciate
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="eyebrow text-xs text-muted-foreground hover:text-foreground transition-colors link-underline pb-1"
                >
                  View All Watches
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
