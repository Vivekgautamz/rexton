import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/shell";
import { RegisterForm } from "@/components/auth/register-form";
import { currentUser } from "@/lib/auth/guards";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a REXTON account.",
  robots: { index: false },
};

export default async function RegisterPage(props: PageProps<"/register">) {
  const searchParams = await props.searchParams;
  const next = safeNext(searchParams.next ?? null, "/account");

  const user = await currentUser();
  if (user) redirect(next);

  return (
    <AuthShell
      eyebrow="Account"
      title="Join REXTON."
      description="One account for orders, addresses, warranty registration and a wishlist you can come back to."
      footer={
        <span>
          By creating an account you agree to keep your collection details in
          one secure place. We never sell your data.
        </span>
      }
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
