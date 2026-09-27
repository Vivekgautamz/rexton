import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/shell";
import {
  ForgotPasswordForm,
  ResetPasswordForm,
} from "@/components/auth/password-forms";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your REXTON account password.",
  robots: { index: false },
};

export default async function ForgotPasswordPage(
  props: PageProps<"/forgot-password">
) {
  const searchParams = await props.searchParams;
  const token =
    typeof searchParams.token === "string" ? searchParams.token : null;

  if (token) {
    return (
      <AuthShell
        eyebrow="Account"
        title="Set a new password."
        description="Choose something you have not used before. All other sessions will be signed out."
      >
        <ResetPasswordForm token={token} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Forgot your password?"
      description="Enter the address on your account and we will send a secure link — valid for 30 minutes."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
