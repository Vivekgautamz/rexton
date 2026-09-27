import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

/**
 * Razorpay integration.
 *
 * With RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET set, every function performs
 * real HTTP calls and real HMAC verification. Without them the module runs in
 * mock mode so checkout, webhooks and order states stay testable locally —
 * mock orders are visibly labelled `mocked: true` and are never mistaken for
 * captured payments.
 */

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: "created" | "paid" | "failed";
  mocked: boolean;
}

const API_BASE = "https://api.razorpay.com/v1";

function authHeader() {
  const token = Buffer.from(`${env.razorpayKeyId}:${env.razorpayKeySecret}`).toString(
    "base64"
  );
  return `Basic ${token}`;
}

async function razorpayFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: { description?: string } })?.error?.description ??
      `Razorpay request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

export async function createRazorpayOrder(input: {
  amount: number; // minor units
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const currency = input.currency ?? "INR";

  if (env.paymentsMocked) {
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount: input.amount,
      currency,
      receipt: input.receipt,
      status: "created",
      mocked: true,
    };
  }

  const order = await razorpayFetch<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      currency,
      receipt: input.receipt,
      notes: input.notes,
    }),
  });

  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    status: order.status === "paid" ? "paid" : "created",
    mocked: false,
  };
}

/**
 * Server-side signature verification. The browser never decides whether a
 * payment succeeded — it can only hand us ids to re-check here.
 */
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (env.paymentsMocked) {
    return params.razorpaySignature === "mock_signature";
  }

  const expected = createHmac("sha256", env.razorpayKeySecret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(params.razorpaySignature ?? "", "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Verifies the X-Razorpay-Signature header on webhook callbacks. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (env.paymentsMocked) return signature === "mock_webhook_signature";

  const expected = createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature ?? "", "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
