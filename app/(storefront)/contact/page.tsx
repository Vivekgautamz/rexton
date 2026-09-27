import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Concierge · REXTON Watches",
  description:
    "Connect with the REXTON Horology Concierge for timepiece consultations, custom sizing, and service requests.",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">REXTON Concierge</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            Horology Concierge & Advisory
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Our specialist horology advisors are at your service for timepiece consultations,
            bespoke fitting advice, and after-sales support across India.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="container-page py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
          {/* Left: Contact Info & Horology Salon */}
          <div className="space-y-8 p-8 bg-[#fbfaf8] border border-hairline">
            <div>
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Client Relations
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Connect with our concierge team directly or visit our private appointment salon in Mumbai.
              </p>
            </div>

            <div className="space-y-6 text-xs divide-y divide-hairline">
              <div className="flex gap-4 pt-4 first:pt-0">
                <Mail className="size-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono uppercase text-muted-foreground text-[10px]">
                    Email Concierge
                  </p>
                  <a
                    href="mailto:concierge@rexton.in"
                    className="font-medium text-foreground hover:text-gold transition-colors text-sm"
                  >
                    concierge@rexton.in
                  </a>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Phone className="size-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono uppercase text-muted-foreground text-[10px]">
                    Direct Telephone
                  </p>
                  <a
                    href="tel:+912280009999"
                    className="font-medium text-foreground hover:text-gold transition-colors text-sm font-mono"
                  >
                    +91 (022) 8000 9999
                  </a>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Clock className="size-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono uppercase text-muted-foreground text-[10px]">
                    Operating Hours
                  </p>
                  <p className="text-foreground">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">Closed on National Holidays</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <MapPin className="size-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono uppercase text-muted-foreground text-[10px]">
                    Atelier & Flagship Salon
                  </p>
                  <p className="text-foreground font-medium">REXTON Horology Studio</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Level 4, The Heritage Pavilion, Nariman Point, Mumbai 400021, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="p-8 bg-background border border-hairline">
            <h2 className="font-serif text-2xl font-normal text-foreground mb-2">
              Send an Enquiry
            </h2>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Complete the enquiry dossier below and our senior watch advisor will personally respond.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
