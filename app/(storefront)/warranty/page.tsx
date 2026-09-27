import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "2-Year International Warranty · REXTON Watches",
  description:
    "Learn about REXTON 2-Year International Manufacturer Warranty coverage, movement regulation, and authorized service centers.",
};

export default function WarrantyPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Horology Guarantee</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            2-Year International Warranty
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Every REXTON timepiece is backed by our comprehensive two-year international manufacturer warranty.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20 max-w-3xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            1. Scope of Coverage
          </h2>
          <p>
            Your REXTON timepiece is warranted against all manufacturing defects in materials and internal mechanical or quartz movement components for a period of twenty-four (24) months from the initial date of purchase.
          </p>
          <p>
            If a defect covered by this warranty arises, REXTON will, at its discretion, either repair the movement using genuine calibrated replacement parts or replace the timepiece with an identical model.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            2. What Is Covered
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Internal mechanical or quartz calibres losing or gaining time beyond certified factory tolerances.</li>
            <li>Mechanical complications, column-wheel chronograph pushers, or calendar mechanisms failing under ordinary usage.</li>
            <li>Loose dial hour markers, hands, or internal crown stems not caused by external shock.</li>
            <li>Water infiltration occurring within the designated ATM depth rating, provided the crown was fully seated/screwed down.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            3. What Is Excluded
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Normal cosmetic wear, scratches, or dents to the 316L case, bezel, or sapphire crystal resulting from daily usage.</li>
            <li>Wear, discoloration, or deterioration of leather, rubber, or mesh straps.</li>
            <li>Damage caused by accidents, drop impact, crushing, exposure to corrosive chemicals, or thermal shock (such as saunas).</li>
            <li>Timepieces serviced, opened, or altered by any non-authorized third-party watch repairer.</li>
          </ul>
        </div>

        <div className="p-8 bg-[#fbfaf8] border border-hairline text-center space-y-3">
          <h3 className="font-serif text-xl font-normal text-foreground">
            Initiate a Warranty Service Claim
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Please have your warranty registration certificate or order confirmation number available when contacting our service atelier.
          </p>
          <div className="pt-2">
            <Button asChild className="h-10 px-6 text-xs uppercase tracking-wider">
              <Link href="/contact">Contact Service Atelier</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
