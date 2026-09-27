import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, ShieldCheck, Mail, Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { logoutAction } from "@/lib/actions/auth";
import { formatDate } from "@/lib/format";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await requireUser("/account");

  const [orderCount, sessionCount] = await Promise.all([
    db.order.count({ where: { userId: user.id } }),
    db.session.count({
      where: { userId: user.id, scope: "customer", expiresAt: { gt: new Date() } },
    }),
  ]);

  const facts = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Mobile", value: user.phone || "Not added" },
    {
      icon: CalendarDays,
      label: "Member since",
      value: formatDate(user.createdAt),
    },
    {
      icon: ShieldCheck,
      label: "Account type",
      value: user.role === "CUSTOMER" ? "Customer" : user.role,
    },
  ];

  return (
    <div className="container-page py-16 lg:py-24">
      <p className="eyebrow text-gold">Account</p>
      <h1 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] leading-none">
        Good to see you,
        <br />
        {user.name.split(" ")[0]}.
      </h1>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {/* Profile */}
        <section>
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h2 className="text-xl">Profile</h2>
            <span className="eyebrow text-muted-foreground">Overview</span>
          </div>

          <dl className="divide-y divide-hairline">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-4 py-5"
              >
                <fact.icon className="size-4 shrink-0 text-gold" />
                <dt className="eyebrow w-36 shrink-0 text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="min-w-0 break-all text-sm">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="h-10 gap-2">
              <Link href="/forgot-password">Change password</Link>
            </Button>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                className="h-10 gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </section>

        {/* Activity */}
        <section>
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h2 className="text-xl">Activity</h2>
            <span className="eyebrow text-muted-foreground">Live</span>
          </div>

          <div className="grid grid-cols-2 gap-px bg-hairline">
            <div className="bg-background p-6">
              <p className="text-4xl leading-none">{orderCount}</p>
              <p className="eyebrow mt-3 text-muted-foreground">Orders</p>
            </div>
            <div className="bg-background p-6">
              <p className="text-4xl leading-none">{sessionCount}</p>
              <p className="eyebrow mt-3 text-muted-foreground">Active sessions</p>
            </div>
          </div>

          <div className="mt-6 border border-hairline bg-muted/40 px-5 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Order history, wishlist and saved addresses open up as each
              section of the store goes live. Your session is secure and
              encrypted end to end.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
