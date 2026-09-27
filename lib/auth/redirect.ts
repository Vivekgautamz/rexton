/**
 * Guards every post-authentication redirect against open-redirect abuse.
 * Only same-origin absolute paths are ever honoured.
 */
export function safeNext(
  value: FormDataEntryValue | string | string[] | null | undefined,
  fallback: string
): string {
  const raw = Array.isArray(value)
    ? (value[0] ?? "").trim()
    : typeof value === "string"
      ? value.trim()
      : "";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) {
    return raw;
  }
  return fallback;
}
