"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { rateLimit, clientKey, resetRateLimit } from "@/lib/rate-limit";
import { isStaffRole } from "@/lib/auth/permissions";
import { safeNext } from "@/lib/auth/redirect";
import type { AuthFormState } from "@/lib/actions/auth";
import { emailSchema, toFieldErrors } from "@/lib/validation/auth";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

/**
 * Admin sign-in. Deliberately separate from the storefront flow: it issues an
 * admin-scoped session, is rate limited more aggressively, and requires a
 * staff role — a normal customer account can never open the dashboard.
 */
export async function adminLoginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const key = await clientKey(`admin-login:${email}`);
  const limited = rateLimit(key, 5, 15 * 60 * 1000);

  if (!limited.success) {
    return { error: "Too many attempts. Please wait 15 minutes." };
  }

  const parsed = adminLoginSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error) };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : false;

  if (!user || !ok || !user.isActive || !isStaffRole(user.role)) {
    // Identical message whether the account is missing, the password is wrong
    // or the account simply has no staff role.
    return { error: "Invalid credentials or insufficient access." };
  }

  await createSession(user.id, "admin");
  resetRateLimit(key);

  redirect(safeNext(formData.get("next"), "/admin"));
}

export async function adminLogoutAction(): Promise<void> {
  await deleteSession("admin");
  redirect("/admin/login");
}
