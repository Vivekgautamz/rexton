import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions · REXTON Watches",
  description:
    "Find answers to common questions about REXTON movements, water resistance, shipping, warranty and authenticity.",
};

const faqs = [
  {
    category: "Horology & Movements",
    items: [
      {
        q: "What movements power REXTON timepieces?",
        a: "REXTON utilizes high-precision Swiss-inspired automatic and quartz calibres. Automatic calibres feature self-winding bi-directional rotors with a 41-hour power reserve, while quartz models use high-torque Japanese and Swiss quartz engines regulated for minimal deviation.",
      },
      {
        q: "How are REXTON movements regulated?",
        a: "Every timepiece is individually placed on a timing machine and regulated across five distinct physical positions (dial up, dial down, and three vertical orientations) over 72 hours to ensure accuracy within ±4 to ±7 seconds per day for automatics.",
      },
      {
        q: "Are REXTON crystals truly scratch-proof?",
        a: "Yes. All REXTON timepieces are fitted with synthetic sapphire crystal rated 9 on the Mohs hardness scale (second only to diamond). Everyday materials such as keys, coins, and grit will not scratch the sapphire glass.",
      },
      {
        q: "What is the water resistance rating?",
        a: "Water resistance ranges from 50 meters (5 ATM) on our dress timepieces to 100 meters (10 ATM) on our Sport and Chronograph models with screw-down casebacks. We recommend avoiding hot showers and saunas, as high-temperature steam may compromise rubber seals over time.",
      },
    ],
  },
  {
    category: "Delivery & Orders",
    items: [
      {
        q: "Is shipping complimentary across India?",
        a: "Yes. REXTON provides 100% complimentary insured express shipping to all serviceable PIN codes throughout India. Every parcel is dispatched with tamper-evident security tape and requires signature upon delivery.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders placed before 2:00 PM IST dispatch within 24 hours. Transit to major metropolitan hubs (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata) takes 2 to 3 business days; regional destinations take 3 to 5 business days.",
      },
      {
        q: "Can I track my delivery in real-time?",
        a: "Yes. Once dispatched, you receive automated SMS and email notifications containing the tracking number and courier dispatch link.",
      },
    ],
  },
  {
    category: "Warranty & Servicing",
    items: [
      {
        q: "What does the 2-Year International Warranty cover?",
        a: "Our warranty covers internal manufacturing defects in the movement, hands, dial, and timekeeping function. It does not cover accidental impact, strap wear-and-tear, or unauthorized third-party modifications.",
      },
      {
        q: "How do I request servicing or repairs?",
        a: "Contact our concierge at concierge@rexton.in with your warranty certification number or order reference. We arrange complimentary insured return pickup to our Mumbai horology service salon.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="border-b border-hairline py-16 md:py-20 bg-[#faf9f6]">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="eyebrow text-gold text-xs">Customer Assistance</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Everything you need to know about our horological craft, shipping, warranty, and care.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20 max-w-3xl mx-auto space-y-12">
        {faqs.map((group) => (
          <div key={group.category} className="space-y-4">
            <h2 className="font-serif text-2xl font-normal text-foreground border-b border-hairline pb-2">
              {group.category}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {group.items.map((item, idx) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${idx}`}
                  className="border-b border-hairline py-1"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline text-foreground py-4 text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-4 font-light">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <div className="p-8 bg-[#fbfaf8] border border-hairline text-center space-y-3 mt-12">
          <h3 className="font-serif text-xl font-normal">Still have questions?</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Our horology advisory team is available to assist you personally with any technical or styling enquiry.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" size="sm" className="text-xs uppercase tracking-wider">
              <Link href="/contact">Speak with Concierge</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
