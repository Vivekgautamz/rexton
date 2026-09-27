import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionScope } from "@/lib/auth/session";
import { isStaffRole, can, type Permission } from "@/lib/auth/permissions";
import type { User } from "@/lib/generated/prisma/client";

const withNext = (path: string, next?: string) =>
  next ? `${path}?next=${encodeURIComponent(next)}` : path;

/** Any authenticated storefront customer. */
export async function requireUser(next?: string): Promise<User> {
  const user = await getSessionUser("customer");
  if (!user) redirect(withNext("/login", next ?? "/account"));
  return user;
}

/** Nullable variant for pages that render differently when signed in. */
export async function currentUser(): Promise<User | null> {
  return getSessionUser("customer");
}

/**
 * Admin access. Requires an *admin-scoped* session, so being signed in on the
 * storefront is never enough to reach the dashboard.
 */
export async function requireAdmin(next?: string): Promise<User> {
  const user = await getSessionUser("admin");
  if (!user) redirect(withNext("/admin/login", next ?? "/admin"));
  if (!isStaffRole(user.role)) redirect("/403");
  return user;
}

export async function currentAdmin(): Promise<User | null> {
  const user = await getSessionUser("admin");
  return user && isStaffRole(user.role) ? user : null;
}

/**
 * For individual admin screens. Throws a redirect to /403 when the signed-in
 * staff member lacks the permission — checked on the server, every time.
 */
export async function requirePermission(
  permission: Permission,
  next?: string
): Promise<User> {
  const user = await requireAdmin(next);
  if (!can(user.role, permission)) redirect("/403");
  return user;
}

export function assertPermission(user: User, permission: Permission) {
  if (!can(user.role, permission)) redirect("/403");
}

export type { SessionScope };
