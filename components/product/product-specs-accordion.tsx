"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatWeight } from "@/lib/format";

interface ProductSpecsAccordionProps {
  product: {
    description: string;
    movement?: string;
    caseMaterial?: string | null;
    caseDiameter?: string | null;
    caseThickness?: string | null;
    dialColor?: string | null;
    strapMaterial?: string | null;
    waterResistance?: string | null;
    glassType?: string | null;
    warranty?: string | null;
    weightGrams?: number | null;
    gender?: string;
    sku: string;
  };
}

export function ProductSpecsAccordion({ product }: ProductSpecsAccordionProps) {
  const specs = [
    { label: "Movement Type", value: product.movement || "Quartz / Regulated" },
    { label: "Case Diameter", value: product.caseDiameter || "40 mm" },
    { label: "Case Thickness", value: product.caseThickness || "10.5 mm" },
    { label: "Case Material", value: product.caseMaterial || "316L Surgical-Grade Stainless Steel" },
    { label: "Dial Finishing", value: product.dialColor || "Sunburst Silver" },
    { label: "Crystal / Glass", value: product.glassType || "Scratch-Resistant Sapphire Crystal (Anti-Reflective)" },
    { label: "Strap / Bracelet", value: product.strapMaterial || "Full-grain Italian Leather" },
    { label: "Water Resistance", value: product.waterResistance || "50 m / 5 ATM" },
    { label: "Weight", value: formatWeight(product.weightGrams) },
    { label: "Warranty", value: product.warranty || "2-Year International Warranty" },
    { label: "Reference SKU", value: product.sku },
  ];

  return (
    <Accordion type="single" collapsible defaultValue="specs" className="w-full border-t border-hairline mt-8">
      {/* 1. Description */}
      <AccordionItem value="description" className="border-b border-hairline py-1">
        <AccordionTrigger className="eyebrow text-xs uppercase hover:no-underline tracking-widest text-foreground py-4">
          The Design & Narrative
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-6 space-y-3">
          <p>{product.description}</p>
          <p className="text-xs italic text-foreground/80 font-serif">
            Every REXTON timepiece is hand-assembled and individually inspected before receiving its serial certification.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* 2. Specifications */}
      <AccordionItem value="specs" className="border-b border-hairline py-1">
        <AccordionTrigger className="eyebrow text-xs uppercase hover:no-underline tracking-widest text-foreground py-4">
          Horological Specifications
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
            {specs.map((item) => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-hairline/60">
                <dt className="text-muted-foreground font-mono">{item.label}</dt>
                <dd className="font-medium text-foreground text-right">{item.value}</dd>
              </div>
            ))}
          </dl>
        </AccordionContent>
      </AccordionItem>

      {/* 3. Materials & Craftsmanship */}
      <AccordionItem value="craftsmanship" className="border-b border-hairline py-1">
        <AccordionTrigger className="eyebrow text-xs uppercase hover:no-underline tracking-widest text-foreground py-4">
          Materials & Finishing
        </AccordionTrigger>
        <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-6 space-y-2">
          <p>
            <strong>316L Stainless Steel:</strong> Corrosion-resistant austenitic steel buffed with a combination of brushed grain and mirror-polished bevels.
          </p>
          <p>
            <strong>Sapphire Crystal:</strong> Mohs 9 hardness scratch-proof sapphire crystal with dual-sided anti-reflective coating for distortion-free legibility.
          </p>
          <p>
            <strong>Precision Tolerances:</strong> Movements calibrated across 5 resting positions to assure peak chronometric performance and longevity.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* 4. Shipping & Delivery */}
      <AccordionItem value="shipping" className="border-b border-hairline py-1">
        <AccordionTrigger className="eyebrow text-xs uppercase hover:no-underline tracking-widest text-foreground py-4">
          Complimentary Delivery
        </AccordionTrigger>
        <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-6 space-y-2">
          <p>
            All REXTON orders qualify for complimentary insured courier shipping across all postal codes in India.
          </p>
          <p>
            Orders placed before 2:00 PM IST dispatch within 24 hours. Transit typically takes 2 to 4 business days with real-time SMS and email tracking.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* 5. Warranty & Service */}
      <AccordionItem value="warranty" className="border-b border-hairline py-1">
        <AccordionTrigger className="eyebrow text-xs uppercase hover:no-underline tracking-widest text-foreground py-4">
          2-Year International Warranty
        </AccordionTrigger>
        <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-6 space-y-2">
          <p>
            Each REXTON timepiece is protected by our comprehensive 2-Year International Manufacturer Warranty, covering internal mechanical or quartz movement defects.
          </p>
          <p>
            Should your timepiece ever require calibration, our dedicated horology service center in Mumbai handles complete inspection and repair.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* 6. Returns & Exchanges */}
      <AccordionItem value="returns" className="border-b border-hairline py-1">
        <AccordionTrigger className="eyebrow text-xs uppercase hover:no-underline tracking-widest text-foreground py-4">
          14-Day Returns & Exchanges
        </AccordionTrigger>
        <AccordionContent className="text-xs leading-relaxed text-muted-foreground pb-6 space-y-2">
          <p>
            We offer a 14-day return and exchange window from the date of delivery.
          </p>
          <p>
            To be eligible, the timepiece must be unworn, in its original presentation box with all certificates, plastic protectors, and tags intact.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
