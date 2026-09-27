"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, checkPasswordStrength } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { sendEmail, emailLayout, emailButton, emailText } from "@/lib/email";
import { rateLimit, clientKey, resetRateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  toFieldErrors,
} from "@/lib/validation/auth";
import { randomBytes, createHash } from "crypto";
import { safeNext } from "@/lib/auth/redirect";
import type { ZodError } from "zod";

export interface AuthFormState {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
}

const valuesFrom = (formData: FormData): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key !== "password" && key !== "confirmPassword") {
      out[key] = value;
    }
  }
  return out;
};

const collect = (error: ZodError): AuthFormState => ({
  fieldErrors: toFieldErrors(error),
});

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const key = await clientKey("register");
  const limited = rateLimit(key, 10, 60 * 60 * 1000);
  if (!limited.success) {
    return { error: "Too many attempts. Try again in an hour.", values: valuesFrom(formData) };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) return { ...collect(parsed.error), values: valuesFrom(formData) };

  const strength = checkPasswordStrength(parsed.data.password);
  if (!strength.ok) {
    return {
      fieldErrors: { password: strength.message },
      values: valuesFrom(formData),
    };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return {
      fieldErrors: { email: "An account with this email already exists." },
      values: valuesFrom(formData),
    };
  }

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER",
    },
  });

  await createSession(user.id, "customer");
  resetRateLimit(key);

  void sendEmail({
    to: user.email,
    userId: user.id,
    type: "welcome",
    subject: "Welcome to REXTON",
    html: emailLayout(
      `Welcome, ${user.name.split(" ")[0]}.`,
      emailText(
        "Your REXTON account is ready. Track orders, save addresses and keep a wishlist of the pieces you are considering."
      ) + emailButton(`${env.appUrl}/account`, "Open your account")
    ),
  }).catch((error) => console.error("[email] welcome failed", error));

  redirect(safeNext(formData.get("next"), "/account"));
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const key = await clientKey(`login:${email}`);
  const limited = rateLimit(key, 6, 15 * 60 * 1000);

  if (!limited.success) {
    return {
      error: "Too many sign-in attempts. Please wait 15 minutes and try again.",
      values: valuesFrom(formData),
    };
  }

  const parsed = loginSchema.safeParse({
    email,
    password: formData.get("password"),
    remember: formData.get("remember") !== "off",
  });

  if (!parsed.success) return { ...collect(parsed.error), values: valuesFrom(formData) };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  // Always run a comparison so a missing account and a wrong password take
  // the same amount of time.
  const hash =
    user?.passwordHash ??
    "$2b$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpQ0G1E5rJ1kE9Yw2pS3nR6mT8YdG";
  const ok = await verifyPassword(parsed.data.password, hash);

  if (!user || !ok || !user.isActive) {
    return {
      error: "Invalid email or password.",
      values: valuesFrom(formData),
    };
  }

  await createSession(user.id, "customer");
  resetRateLimit(key);

  redirect(safeNext(formData.get("next"), "/account"));
}

export async function logoutAction(): Promise<void> {
  await deleteSession("customer");
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const key = await clientKey("forgot");
  if (!rateLimit(key, 5, 60 * 60 * 1000).success) {
    return { error: "Too many reset requests. Try again shortly." };
  }

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return collect(parsed.error);

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  // Always report success — never reveal whether an address is registered.
  const success =
    "If an account exists for that address, a reset link is on its way.";

  if (user) {
    const token = randomBytes(32).toString("base64url");
    await db.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash: createHash("sha256").update(token).digest("hex"),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    const url = `${env.appUrl}/forgot-password?token=${token}`;
    void sendEmail({
      to: user.email,
      userId: user.id,
      type: "password_reset",
      subject: "Reset your REXTON password",
      html: emailLayout(
        "Reset your password",
        emailText(
          "We received a request to reset the password on your REXTON account. The link below expires in 30 minutes."
        ) +
          emailButton(url, "Reset password") +
          emailText(
            "If you did not request this, you can safely ignore this email — your password stays unchanged."
          )
      ),
    }).catch((error) => console.error("[email] reset failed", error));
  }

  return { success };
}

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const key = await clientKey("reset");
  if (!rateLimit(key, 10, 60 * 60 * 1000).success) {
    return { error: "Too many attempts. Try again shortly." };
  }

  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) return collect(parsed.error);

  const strength = checkPasswordStrength(parsed.data.password);
  if (!strength.ok) {
    return { fieldErrors: { password: strength.message } };
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const reset = await db.passwordReset.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!reset || reset.usedAt || reset.expiresAt.getTime() < Date.now()) {
    return { error: "That reset link has expired. Request a new one." };
  }

  await db.$transaction([
    db.user.update({
      where: { id: reset.userId },
      data: { passwordHash: await hashPassword(parsed.data.password) },
    }),
    db.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    db.session.deleteMany({ where: { userId: reset.userId } }),
  ]);

  return { success: "Password updated. Sign in with your new password." };
}
