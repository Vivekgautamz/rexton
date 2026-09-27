import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · REXTON Watches",
  description: "Learn how REXTON protects customer privacy, payment data, and personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Legal & Trust</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            We value your confidentiality as strictly as we guard the precision of our movements.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20 max-w-3xl mx-auto space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            1. Information Collection
          </h2>
          <p>
            When you purchase a timepiece or create an account with REXTON, we collect your name, shipping address, telephone number, and email. Payment details are processed directly through PCI-DSS Level 1 certified gateways (Razorpay). REXTON never stores full credit card numbers or UPI PINs on our servers.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            2. Use of Information
          </h2>
          <p>
            Your information is used strictly to fulfill orders, issue warranty serial registrations, arrange insured courier dispatch, and communicate relevant servicing updates. We never sell, lease, or distribute customer details to third-party marketing entities.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-foreground font-normal">
            3. Security Protocols
          </h2>
          <p>
            All communications are encrypted using Transport Layer Security (TLS 1.3). Account authentication relies on cryptographically salted password hashes and secure server-managed HTTP-only sessions.
          </p>
        </div>
      </section>
    </div>
  );
}
