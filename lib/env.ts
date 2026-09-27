/**
 * Centralised environment access.
 *
 * Nothing here throws at import time so `next build` works before secrets exist.
 * Feature modules call `requireEnv()` when they actually need a value, which
 * turns a missing key into a readable error instead of an undefined leak.
 */

const read = (key: string, fallback?: string): string | undefined => {
  const value = process.env[key];
  if (value !== undefined && value !== "") return value;
  return fallback;
};

export function requireEnv(key: string): string {
  const value = read(key);
  if (!value) {
    throw new Error(
      `Missing environment variable ${key}. Add it to .env (see .env.example).`
    );
  }
  return value;
}

export const env = {
  // Core
  get appUrl() {
    return read("APP_URL", "http://localhost:3000")!;
  },
  get nodeEnv() {
    return read("NODE_ENV", "development")!;
  },
  get isProduction() {
    return this.nodeEnv === "production";
  },
  get sessionSecret() {
    return read("SESSION_SECRET", "rexton-dev-secret-change-me")!;
  },
  get databaseUrl() {
    return read("DATABASE_URL", "file:./dev.db")!;
  },

  // Payments — Razorpay
  get razorpayKeyId() {
    return read("RAZORPAY_KEY_ID")!;
  },
  get razorpayKeySecret() {
    return read("RAZORPAY_KEY_SECRET")!;
  },
  get razorpayWebhookSecret() {
    return read("RAZORPAY_WEBHOOK_SECRET")!;
  },
  /** Falls back to true in development so checkout flows stay testable. */
  get paymentsMocked() {
    const flag = read("MOCK_PAYMENTS");
    if (flag !== undefined) return flag === "true" || flag === "1";
    return !read("RAZORPAY_KEY_ID");
  },

  // Email — Resend or SMTP
  get emailApiKey() {
    return read("RESEND_API_KEY")!;
  },
  get smtpHost() {
    return read("SMTP_HOST")!;
  },
  get smtpPort() {
    return Number(read("SMTP_PORT", "587"));
  },
  get smtpUser() {
    return read("SMTP_USER")!;
  },
  get smtpPass() {
    return read("SMTP_PASS")!;
  },
  get emailFrom() {
    return read("EMAIL_FROM", "REXTON Watches <no-reply@rexton.in>")!;
  },
  /** True when no transactional provider is configured. */
  get emailMocked() {
    return !read("RESEND_API_KEY") && !read("SMTP_HOST");
  },

  // Image storage — Cloudinary
  get cloudinaryCloudName() {
    return read("CLOUDINARY_CLOUD_NAME")!;
  },
  get cloudinaryApiKey() {
    return read("CLOUDINARY_API_KEY")!;
  },
  get cloudinaryApiSecret() {
    return read("CLOUDINARY_API_SECRET")!;
  },
  get storageMocked() {
    return !read("CLOUDINARY_CLOUD_NAME");
  },

  // Business
  get defaultCurrency() {
    return read("NEXT_PUBLIC_DEFAULT_CURRENCY", "INR")!;
  },
  get storeName() {
    return read("NEXT_PUBLIC_STORE_NAME", "REXTON WATCHES")!;
  },
} as const;
