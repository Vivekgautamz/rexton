import "server-only";
import { cookies, headers } from "next/headers";
import { randomBytes } from "crypto";
import { cache } from "react";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export type SessionScope = "customer" | "admin";

export const SESSION_COOKIE = {
  customer: "rx_session",
  admin: "rx_admin",
} as const;

const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const ADMIN_MAX_AGE = 60 * 60 * 12; // 12 hours
const RENEW_THRESHOLD_MS = 1000 * 60 * 60 * 24; // extend when < 1 day left

const maxAgeFor = (scope: SessionScope) =>
  scope === "admin" ? ADMIN_MAX_AGE : CUSTOMER_MAX_AGE;

const generateToken = () => randomBytes(32).toString("base64url");

async function setSessionCookie(scope: SessionScope, token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE[scope], token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: maxAgeFor(scope),
  });
}

export async function createSession(
  userId: string,
  scope: SessionScope = "customer"
) {
  const token = generateToken();
  const now = new Date();

  await db.session.create({
    data: {
      token,
      scope,
      userId,
      expiresAt: new Date(now.getTime() + maxAgeFor(scope) * 1000),
      userAgent: (await headers()).get("user-agent")?.slice(0, 255) ?? null,
      ip: (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    },
  });

  await setSessionCookie(scope, token);
  return token;
}

/**
 * Resolves the session for a scope. Cached per request so layout + page + data
 * loaders share one lookup.
 */
export const getSessionUser = cache(async (scope: SessionScope = "customer") => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE[scope])?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.scope !== scope) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSession(scope);
    return null;
  }
  if (!session.user.isActive) {
    await deleteSession(scope);
    return null;
  }

  // Sliding renewal — keep active admins/customers logged in.
  if (session.expiresAt.getTime() - Date.now() < RENEW_THRESHOLD_MS) {
    await db.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + maxAgeFor(scope) * 1000) },
    });
  }

  return session.user;
});

export async function deleteSession(scope: SessionScope = "customer") {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE[scope])?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } });
    store.delete(SESSION_COOKIE[scope]);
  }
}

/** Used after a password change / account compromise. */
export async function deleteAllSessions(userId: string, keep?: SessionScope) {
  await db.session.deleteMany({
    where: { userId, ...(keep ? { scope: { not: keep } } : {}) },
  });
}
