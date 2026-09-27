/**
 * Money helpers. Every monetary value in the database is an integer in minor
 * units (paise): ₹1,299.00 is stored as 129900.
 */

export const CURRENCY_LOCALES: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "en-AE",
};

export function formatMinor(
  amount: number,
  currency = "INR",
  options: { showDecimals?: boolean; compact?: boolean } = {}
): string {
  const locale = CURRENCY_LOCALES[currency] ?? "en-IN";
  const showDecimals = options.showDecimals ?? false;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount / 100);
}

export const formatPrice = (amount: number, currency = "INR") =>
  formatMinor(amount, currency);

/** 129900 → 1299.00 — used by forms that edit prices in rupees. */
export const minorToMajor = (amount: number) => (amount / 100).toFixed(2);

/** "1299.00" → 129900 — used when reading prices back out of a form. */
export const majorToMinor = (value: string | number): number => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
};

export function discountPercent(
  price: number,
  compareAtPrice?: number | null
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export const formatWeight = (grams?: number | null) =>
  grams ? `${grams} g` : "—";

export function formatDate(
  date: Date | string | number,
  style: "short" | "long" | "time" = "long"
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "—";

  if (style === "time") {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: style === "short" ? "short" : "long",
    year: "numeric",
  }).format(d);
}

export function timeAgo(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let value = seconds;
  for (const [step, unit] of units) {
    if (Math.abs(value) < step) {
      return new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" }).format(
        -Math.floor(value),
        unit
      );
    }
    value /= step;
  }
  return "just now";
}
