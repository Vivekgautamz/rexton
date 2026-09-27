import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About REXTON · Swiss Timeless Root",
  description:
    "Rooted in Swiss discipline, engineered in India. Discover the philosophy, materials, and relentless standards behind REXTON timepieces.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="border-b border-hairline py-20 md:py-28 bg-[#faf9f6]">
        <div className="container-page max-w-4xl text-center mx-auto">
          <p className="eyebrow text-gold text-xs">Our Heritage & Discipline</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-normal text-foreground leading-[1.05]">
            Rooted in Swiss discipline.
            <br />
            <span className="italic font-light">Crafted for those who value time.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground font-light max-w-2xl mx-auto">
            REXTON began with a refusal to compromise: that a watch should never be a disposable accessory, but a timeless mechanical heirloom constructed to outlast the generations that wear it.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="container-page py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
              The Swiss Timeless Root
            </h2>
            <p>
              In traditional horology, true luxury is not measured by ostentation, but by tolerances so tight they can only be felt through touch and seen under magnification.
            </p>
            <p>
              We established REXTON to bridge traditional Swiss watchmaking ethos with modern high-precision engineering in India. Every design begins in Geneva with pure geometric proportion studies before entering manufacture using 316L austenitic stainless steel and anti-reflective sapphire crystals.
            </p>
            <p>
              Before a REXTON timepiece is sealed and packaged, its movement undergoes regulation across five separate physical positions to verify chronometric stability under diverse everyday conditions.
            </p>
          </div>

          <div className="relative aspect-square bg-[#f4f2ec] border border-hairline p-8 flex items-center justify-center">
            <div className="relative size-72">
              <Image
                src="/images/products/watch-silver.svg"
                alt="REXTON Heritage Craftsmanship"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Horology Pillars */}
      <section id="craftsmanship" className="border-t border-b border-hairline bg-[#fbfaf8] py-20">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow text-gold text-xs">Horological Integrity</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal">
              Uncompromising Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-background border border-hairline">
              <Clock className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-xl font-normal">5-Position Regulation</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-light">
                Dial up, dial down, crown left, crown up, crown down. Tested across 72 continuous hours to ensure peerless rate consistency.
              </p>
            </div>

            <div className="p-8 bg-background border border-hairline">
              <Award className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-xl font-normal">316L Surgical Steel</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-light">
                Austenitic steel boasting exceptional resistance to sea salt, perspiration, and impact, hand-buffed with contrasting satin and mirror polishes.
              </p>
            </div>

            <div className="p-8 bg-background border border-hairline">
              <ShieldCheck className="size-6 text-gold mb-4" />
              <h3 className="font-serif text-xl font-normal">Sapphire Crystal</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-light">
                Synthetic sapphire crystal rated 9 on the Mohs hardness scale. Coated with anti-reflective treatment for distortion-free clarity under bright sun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-normal">
          Experience REXTON on Your Wrist
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto font-light">
          Complimentary insured delivery, 14-day inspection, and 2-year international warranty on every model.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="h-12 px-8 uppercase tracking-widest text-xs">
            <Link href="/shop" className="flex items-center gap-2">
              <span>Explore Timepieces</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
