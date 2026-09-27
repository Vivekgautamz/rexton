import type { Role } from "@/lib/generated/prisma/enums";

/**
 * Server-side permission model. Every admin action checks this — hiding a
 * button in the UI is never the security boundary.
 */

export const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "STAFF"];

export type Permission =
  | "dashboard:read"
  | "products:read"
  | "products:write"
  | "products:delete"
  | "orders:read"
  | "orders:write"
  | "orders:refund"
  | "customers:read"
  | "customers:write"
  | "inventory:read"
  | "inventory:write"
  | "coupons:read"
  | "coupons:write"
  | "reviews:read"
  | "reviews:moderate"
  | "content:read"
  | "content:write"
  | "analytics:read"
  | "settings:read"
  | "settings:write";

const STAFF_PERMISSIONS: Permission[] = [
  "dashboard:read",
  "products:read",
  "orders:read",
  "orders:write",
  "customers:read",
  "inventory:read",
  "coupons:read",
  "reviews:read",
  "reviews:moderate",
  "content:read",
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...STAFF_PERMISSIONS,
  "products:write",
  "products:delete",
  "orders:refund",
  "customers:write",
  "inventory:write",
  "coupons:write",
  "content:write",
  "analytics:read",
  "settings:read",
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  "settings:write",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  CUSTOMER: [],
  STAFF: STAFF_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
};

export const isStaffRole = (role: Role) => ADMIN_ROLES.includes(role);

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAll(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p));
}
