import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy · REXTON Watches",
  description:
    "Complimentary insured express delivery across India. Learn about dispatch times, tamper-proof packaging, and delivery tracking.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Delivery Standards</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Every REXTON timepiece travels with full transit insurance in specialized tamper-proof presentation cases.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20 max-w-3xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            1. Complimentary Express Shipping Across India
          </h2>
          <p>
            REXTON provides 100% complimentary express shipping on all timepiece orders shipped within India.
            There are no hidden handling, packaging, or insurance surcharges applied at checkout.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            2. Dispatch Timelines
          </h2>
          <p>
            Orders placed on business days before 2:00 PM IST are inspected, regulated, and dispatched within 24 to 48 hours. Orders placed on weekends or national holidays will dispatch on the following business day.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            3. Estimated Transit Times
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata):</strong> 2 to 3 business days.</li>
            <li><strong>Tier 2 & Tier 3 Cities:</strong> 3 to 5 business days.</li>
            <li><strong>Special Transit Zones (Northeast, Jammu & Kashmir, Island territories):</strong> 5 to 7 business days.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            4. Insured Packaging & Tamper-Evident Seals
          </h2>
          <p>
            Every order is sealed in an unmarked outer delivery carton secured with serialized holographic tamper-evident tape. Inside, your watch rests inside the official REXTON presentation box alongside its warranty booklet and microfiber polishing cloth.
          </p>
          <p>
            <strong>Crucial:</strong> If the outer security tape appears cut, resealed, or tampered with at the time of delivery, please refuse the package and notify concierge@rexton.in immediately.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            5. International Shipping
          </h2>
          <p>
            While our initial launch prioritizes clients within India, our logistics infrastructure is prepared for worldwide DHL Express dispatch. For international enquiries, please connect with concierge@rexton.in.
          </p>
        </div>
      </section>
    </div>
  );
}
