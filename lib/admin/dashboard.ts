import "server-only";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const AWAITING = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"] as const;

export interface DashboardStats {
  revenueAllTime: string;
  revenue30d: string;
  orderCount: number;
  orders30d: number;
  customerCount: number;
  publishedProducts: number;
  lowStock: number;
  outOfStock: number;
  awaitingFulfilment: number;
  pendingReviews: number;
  updatedAt: string;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
  }>;
}

/**
 * All dashboard numbers are calculated from live database rows — there is no
 * cached or mocked analytics layer.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const since30d = new Date(now.getTime() - THIRTY_DAYS_MS);

  const [
    paidRevenue,
    orderCount,
    orders30d,
    revenue30d,
    customerCount,
    productCount,
    lowStockCount,
    outOfStockCount,
    awaitingCount,
    pendingReviewCount,
    recentOrders,
  ] = await Promise.all([
    db.order.aggregate({
      where: {
        paymentStatus: { in: ["PAID", "REFUNDED", "PARTIALLY_REFUNDED"] },
      },
      _sum: { total: true },
    }),
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: since30d } } }),
    db.order.aggregate({
      where: {
        createdAt: { gte: since30d },
        paymentStatus: { in: ["PAID", "REFUNDED", "PARTIALLY_REFUNDED"] },
      },
      _sum: { total: true },
    }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count({ where: { isPublished: true } }),
    db.product.count({
      where: { isPublished: true, stock: { gt: 0, lte: 5 } },
    }),
    db.product.count({ where: { isPublished: true, stock: 0 } }),
    db.order.count({ where: { status: { in: [...AWAITING] } } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    revenueAllTime: formatPrice(paidRevenue._sum.total ?? 0),
    revenue30d: formatPrice(revenue30d._sum.total ?? 0),
    orderCount,
    orders30d,
    customerCount,
    publishedProducts: productCount,
    lowStock: lowStockCount,
    outOfStock: outOfStockCount,
    awaitingFulfilment: awaitingCount,
    pendingReviews: pendingReviewCount,
    updatedAt: now.toISOString(),
    recentOrders,
  };
}
