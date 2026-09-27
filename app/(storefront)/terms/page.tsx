import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions · REXTON Watches",
  description: "Terms and conditions governing the purchase and ownership of REXTON timepieces.",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Legal Standards</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Please read these terms carefully before acquiring a REXTON timepiece or using our digital services.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20 max-w-3xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            1. Ordering & Contract Formation
          </h2>
          <p>
            An order placed on rexton.in represents an offer to purchase. A legally binding purchase contract is established only upon electronic issuance of an Order Confirmation containing your assigned order reference number and invoice.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            2. Pricing & Currency
          </h2>
          <p>
            All prices listed on rexton.in are stated in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) and insured courier delivery within India. We reserve the right to correct typographical pricing discrepancies prior to order fulfillment.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            3. Intellectual Property
          </h2>
          <p>
            All trademarks, logos, typography, horological case geometry, and editorial content presented on this website are the proprietary property of REXTON Watches. Any unauthorized replication is strictly prohibited.
          </p>
        </div>
      </section>
    </div>
  );
}
