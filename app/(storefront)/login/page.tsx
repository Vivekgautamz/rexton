import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/shell";
import { LoginForm } from "@/components/auth/login-form";
import { currentUser } from "@/lib/auth/guards";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your REXTON account.",
  robots: { index: false },
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const next = safeNext(searchParams.next ?? null, "/account");

  const user = await currentUser();
  if (user) redirect(next);

  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back."
      description="Sign in to see your orders, saved addresses and warranty records."
      footer={
        <span>
          Looking for a new timepiece? REXTON Watchmaker access is opening
          shortly â€” your account now carries you through it.
        </span>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
