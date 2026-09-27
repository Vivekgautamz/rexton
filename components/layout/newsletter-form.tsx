"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  subscribeAction,
  type NewsletterState,
} from "@/lib/actions/newsletter";

const initial: NewsletterState = {};

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeAction,
    initial
  );

  if (state.message) {
    return (
      <p className="flex items-center gap-2 text-sm text-gold">
        <Check className="size-4" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="w-full">
      <div className="flex items-center gap-0 border-b border-foreground/25 focus-within:border-gold">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          disabled={pending}
          className="h-11 gap-2 px-2 text-foreground hover:bg-transparent hover:text-gold"
        >
          {pending ? "Joining…" : "Subscribe"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {state.error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
