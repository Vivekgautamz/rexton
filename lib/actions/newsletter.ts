"use server";

import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export interface NewsletterState {
  message?: string;
  error?: string;
}

export async function subscribeAction(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const key = await clientKey("newsletter");
  if (!rateLimit(key, 5, 60 * 60 * 1000).success) {
    return { error: "Too many attempts. Try again shortly." };
  }

  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const existing = await db.newsletterSubscriber.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing && existing.isActive) {
    return { message: "You are already on the list." };
  }

  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email, isActive: true },
    update: { isActive: true, subscribedAt: new Date() },
  });

  return { message: "Welcome to the REXTON world." };
}
