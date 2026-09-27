import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Journal · REXTON Watches",
  description:
    "Essays, horological studies, and technical notes from the REXTON watchmaking atelier.",
};

export default async function JournalPage() {
  const posts = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-hairline py-16 md:py-24 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Horological Chronicle</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-normal text-foreground">
            The REXTON Journal
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
            Behind the dials and tolerances. Technical treatises, historical perspectives,
            and field notes from our master watchmakers.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-page py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col border border-hairline bg-[#fbfaf8] justify-between overflow-hidden group hover:border-gold/60 transition-all duration-300"
            >
              {/* Cover visual */}
              <div className="relative aspect-[16/10] w-full bg-[#f4f2ec] border-b border-hairline overflow-hidden p-6 flex items-center justify-center">
                <div className="relative size-36 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={post.coverImage || "/images/products/watch-silver.svg"}
                    alt={post.title}
                    fill
                    className="object-contain"
                  />
                </div>
                {post.category && (
                  <span className="absolute top-3 left-3 bg-background/90 border border-hairline px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gold">
                    {post.category.name}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mb-2">
                    <Clock className="size-3" />
                    <span>{formatDate(post.publishedAt || post.createdAt, "short")}</span>
                    {post.author && (
                      <>
                        <span>·</span>
                        <span>By {post.author.name}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-serif text-xl font-normal text-foreground group-hover:text-gold transition-colors line-clamp-2">
                    <Link href={`/journal/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3 font-light">
                    {post.excerpt || post.content.slice(0, 160) + "..."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-hairline">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="eyebrow text-xs text-foreground group-hover:text-gold flex items-center gap-1.5 transition-colors uppercase tracking-wider font-mono text-[11px]"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
