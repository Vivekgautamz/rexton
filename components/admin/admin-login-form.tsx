"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLoginAction } from "@/lib/actions/admin-auth";
import type { AuthFormState } from "@/lib/actions/auth";

const initial: AuthFormState = {};

export function AdminLoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(
    adminLoginAction,
    initial
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {state.error ? (
        <div
          className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Staff email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@rexton.in"
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email ? (
          <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password ? (
          <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full gap-2"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        {pending ? "Verifying…" : "Enter dashboard"}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Customer accounts cannot access this area. Sessions issued here are
        scoped to the dashboard only.
      </p>
    </form>
  );
}
