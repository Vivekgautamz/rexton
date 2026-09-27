import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { currentAdmin } from "@/lib/auth/guards";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const next = safeNext(searchParams.next ?? null, "/admin");

  const admin = await currentAdmin();
  if (admin) redirect(next);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <Logo href="/" tagline className="items-start" />

        <div>
          <p className="eyebrow text-gold">REXTON Control</p>
          <h1 className="mt-6 text-[clamp(2.5rem,4vw,3.75rem)] leading-[0.95]">
            The back
            <br />
            of the house.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
            Orders, inventory, customers and analytics â€” everything the
            storefront stands on, in one place.
          </p>
        </div>

        <p className="eyebrow text-paper/40">Swiss Timeless Root</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-14 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo href="/" tagline className="mb-10 items-start" />
          </div>

          <p className="eyebrow text-muted-foreground">Staff access</p>
          <h2 className="mt-5 text-4xl leading-tight">Sign in.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Authorised REXTON personnel only. Every action in the dashboard is
            logged.
          </p>

          <div className="mt-9">
            <AdminLoginForm next={next} />
          </div>

          <p className="mt-10 border-t border-hairline pt-6 text-xs text-muted-foreground">
            <Link href="/" className="link-underline hover:text-foreground">
              â† Back to the storefront
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
