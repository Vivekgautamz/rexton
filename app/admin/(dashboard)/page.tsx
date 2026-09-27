import type { Metadata } from "next";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Star,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requirePermission } from "@/lib/auth/guards";
import { getDashboardStats } from "@/lib/admin/dashboard";
import { formatPrice, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await requirePermission("dashboard:read", "/admin");
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Revenue (all time)",
      value: stats.revenueAllTime,
      meta: `${stats.revenue30d} in 30 days`,
      icon: IndianRupee,
    },
    {
      label: "Orders",
      value: String(stats.orderCount),
      meta: `${stats.orders30d} in the last 30 days`,
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      value: String(stats.customerCount),
      meta: "Registered accounts",
      icon: Users,
    },
    {
      label: "Published products",
      value: String(stats.publishedProducts),
      meta: `${stats.lowStock} low · ${stats.outOfStock} out of stock`,
      icon: Package,
    },
    {
      label: "Awaiting fulfilment",
      value: String(stats.awaitingFulfilment),
      meta: "Pending → Packed",
      icon: Clock,
    },
    {
      label: "Reviews to moderate",
      value: String(stats.pendingReviews),
      meta: "Awaiting approval",
      icon: Star,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">REXTON Control</p>
          <h1 className="mt-3 text-4xl leading-none">Overview</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {formatDate(stats.updatedAt, "time")}
        </p>
      </div>

      <div className="grid gap-px bg-hairline sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-muted-foreground">{stat.label}</p>
              <stat.icon className="size-4 text-gold" />
            </div>
            <p className="mt-4 text-3xl leading-none">{stat.value}</p>
            <p className="mt-3 text-xs text-muted-foreground">{stat.meta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border-hairline">
          <CardHeader className="border-b border-hairline">
            <CardTitle className="text-base font-medium">
              Recent orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <ShoppingCart className="size-6 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium">No orders yet</p>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  Once the storefront starts taking orders, they will appear
                  here with live payment and fulfilment status.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Placed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.customerName}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-hairline text-[10px] uppercase tracking-widest"
                        >
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDate(order.createdAt, "short")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-hairline">
          <CardHeader className="border-b border-hairline">
            <CardTitle className="text-base font-medium">
              Attention needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-px bg-hairline p-0">
            <AlertRow
              icon={AlertTriangle}
              title="Low stock"
              value={stats.lowStock}
              hint="5 units or fewer"
            />
            <AlertRow
              icon={Package}
              title="Out of stock"
              value={stats.outOfStock}
              hint="Unavailable on the storefront"
            />
            <AlertRow
              icon={Clock}
              title="Orders awaiting action"
              value={stats.awaitingFulfilment}
              hint="Confirm, process or pack"
            />
            <AlertRow
              icon={Star}
              title="Reviews pending"
              value={stats.pendingReviews}
              hint="Moderation queue"
            />
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Modules for products, orders, customers, inventory, coupons and
        analytics connect to this dashboard next —{" "}
        <Link href="/" className="link-underline hover:text-foreground">
          view the storefront
        </Link>
        .
      </p>
    </div>
  );
}

function AlertRow({
  icon: Icon,
  title,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  hint: string;
}) {
  const isEmpty = value === 0;

  return (
    <div className="flex items-center gap-4 bg-card px-6 py-5">
      <Icon
        className={`size-4 shrink-0 ${isEmpty ? "text-muted-foreground/50" : "text-gold"}`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{hint}</p>
      </div>
      <span
        className={`text-lg leading-none ${isEmpty ? "text-muted-foreground/50" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
