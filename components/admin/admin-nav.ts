import { LayoutDashboard, type LucideIcon } from "lucide-react";
import { can, type Permission } from "@/lib/auth/permissions";
import type { Role } from "@/lib/generated/prisma/enums";

/**
 * Icon registry lives here so nav data can cross the server -> client
 * boundary as plain strings; components themselves never leave the module.
 */
export const ADMIN_NAV_ICONS = {
  overview: LayoutDashboard,
} satisfies Record<string, LucideIcon>;

export type AdminNavIcon = keyof typeof ADMIN_NAV_ICONS;

export interface AdminNavItem {
  href: string;
  label: string;
  icon: AdminNavIcon;
  permission: Permission;
}

/**
 * Only routes that exist are listed. Products, Orders, Customers, Inventory,
 * Coupons, Reviews, Content, Analytics and Settings are added here as each
 * module ships — the sidebar and the server-side permission filter both read
 * from this single list.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: "overview",
    permission: "dashboard:read",
  },
];

/** Filtered on the server — the sidebar never shows an unreachable link. */
export function adminNavForRole(role: Role): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => can(role, item.permission));
}
