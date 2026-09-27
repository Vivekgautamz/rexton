import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy · REXTON Watches",
  description:
    "14-day inspection and return policy for REXTON timepieces. Learn about our inspection process, refunds, and exchanges.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Customer Confidence</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            Returns & Exchange Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            We provide a 14-day inspection period to ensure complete satisfaction with your REXTON timepiece.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20 max-w-3xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            1. 14-Day Inspection Window
          </h2>
          <p>
            You may request a return or exchange within 14 calendar days from the date of confirmed delivery.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            2. Condition for Return Acceptance
          </h2>
          <p>
            Because fine horology relies on micro-tolerances and unblemished metal finishing, returned watches must satisfy the following strict criteria:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>The timepiece must be completely unworn, free from micro-scratches, scuffs, or resizing marks.</li>
            <li>All factory protective films on the dial, bezel, and caseback must remain intact and undisturbed.</li>
            <li>The leather strap or steel bracelet must show no signs of bending, creasing, or link removal.</li>
            <li>All original accessories, including presentation box, warranty certificate card, and serial tags, must be returned in mint condition.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            3. Return Pickup & Horological Inspection
          </h2>
          <p>
            Upon submitting a return request via your customer account dashboard or by emailing concierge@rexton.in, our logistics team arranges an insured courier pickup from your address.
          </p>
          <p>
            Once received at our Mumbai atelier, our master watchmakers inspect the piece under magnification within 48 hours to confirm original factory state and movement operation.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            4. Refund Processing
          </h2>
          <p>
            Upon inspection approval, the complete order value will be refunded directly to your original payment method (Credit Card, UPI, Net Banking). Refunds generally reflect in your account within 5 to 7 business days, depending on your banking provider.
          </p>
        </div>
      </section>
    </div>
  );
}
