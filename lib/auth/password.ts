import "server-only";
import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

export interface PasswordStrength {
  ok: boolean;
  message?: string;
}

/** Minimum bar for customer and admin passwords alike. */
export function checkPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return { ok: false, message: "Use at least 8 characters." };
  if (password.length > 128) return { ok: false, message: "Password is too long." };

  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) =>
    re.test(password)
  ).length;

  if (classes < 3) {
    return {
      ok: false,
      message: "Mix at least three of: lowercase, uppercase, numbers, symbols.",
    };
  }

  const COMMON = ["password", "12345678", "qwerty", "letmein", "welcome"];
  if (COMMON.some((c) => password.toLowerCase().includes(c))) {
    return { ok: false, message: "That password is too common." };
  }

  return { ok: true };
}
