import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

interface JournalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JournalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return { title: "Article Not Found · REXTON Watches" };
  }

  return {
    title: `${post.title} · The REXTON Journal`,
    description: post.excerpt || post.title,
  };
}

export default async function JournalDetailPage({
  params,
}: JournalDetailPageProps) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-b border-hairline py-16 md:py-24 bg-[#faf9f6]">
        <div className="container-page max-w-3xl mx-auto">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Journal</span>
          </Link>

          {post.category && (
            <p className="eyebrow text-gold text-xs">{post.category.name}</p>
          )}

          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted-foreground pt-4 border-t border-hairline">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>{formatDate(post.publishedAt || post.createdAt, "long")}</span>
            </span>
            {post.author && (
              <>
                <span>·</span>
                <span>Written by {post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="container-page max-w-3xl mx-auto py-16 md:py-20">
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full bg-[#f4f2ec] border border-hairline mb-12 flex items-center justify-center p-8">
            <div className="relative size-64">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground font-light prose prose-neutral max-w-none">
          {post.content.split("\n\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
