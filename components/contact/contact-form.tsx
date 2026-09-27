"use client";

import React, { useActionState } from "react";
import { submitContactMessage, ContactState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const initialState: ContactState = {};
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    initialState
  );

  if (state.success) {
    return (
      <div className="p-8 bg-[#fbfaf8] border border-hairline text-center space-y-3">
        <CheckCircle2 className="size-8 text-gold mx-auto" />
        <h3 className="font-serif text-2xl font-normal text-foreground">Message Received</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow text-[11px] block mb-1 text-foreground">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full h-11 px-3 bg-background border border-hairline focus:border-gold outline-none text-xs"
            placeholder="e.g. Vikramaditya Sen"
          />
          {state.errors?.name && (
            <p className="text-[10px] text-destructive mt-1 font-mono">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="eyebrow text-[11px] block mb-1 text-foreground">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full h-11 px-3 bg-background border border-hairline focus:border-gold outline-none text-xs"
            placeholder="e.g. v.sen@example.in"
          />
          {state.errors?.email && (
            <p className="text-[10px] text-destructive mt-1 font-mono">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow text-[11px] block mb-1 text-foreground">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full h-11 px-3 bg-background border border-hairline focus:border-gold outline-none text-xs"
            placeholder="+91 98000 00000"
          />
        </div>

        <div>
          <label className="eyebrow text-[11px] block mb-1 text-foreground">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            required
            className="w-full h-11 px-3 bg-background border border-hairline focus:border-gold outline-none text-xs"
            placeholder="Product Enquiry / Bespoke Consultation"
          />
          {state.errors?.subject && (
            <p className="text-[10px] text-destructive mt-1 font-mono">{state.errors.subject[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="eyebrow text-[11px] block mb-1 text-foreground">
          Enquiry or Message *
        </label>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full p-3 bg-background border border-hairline focus:border-gold outline-none text-xs leading-relaxed"
          placeholder="Please share your query regarding specifications, sizing, delivery timelines or servicing..."
        />
        {state.errors?.message && (
          <p className="text-[10px] text-destructive mt-1 font-mono">{state.errors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 uppercase tracking-widest text-xs font-medium bg-ink text-paper hover:bg-gold hover:text-white transition-colors"
      >
        {isPending ? "Transmitting..." : "Send Concierge Message"}
      </Button>
    </form>
  );
}
