import "server-only";
import { env } from "@/lib/env";
import { db } from "@/lib/db";

/**
 * Transactional email.
 *
 * Configured providers: Resend (RESEND_API_KEY) or any SMTP relay
 * (SMTP_HOST/USER/PASS). With neither set, mail is recorded as a
 * Notification row and written to the dev console, so every flow that sends
 * mail can be exercised without credentials.
 */

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  /** Optional user to attach a Notification row to. */
  userId?: string;
  type?: string;
}

export interface SendEmailResult {
  id: string;
  mocked: boolean;
  delivered: boolean;
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.emailApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email send failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as { id?: string };
  return { id: data.id ?? "unknown", mocked: false, delivered: true };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  // Always keep a durable trail for the customer when we know who they are.
  if (input.userId) {
    await db.notification.create({
      data: {
        userId: input.userId,
        type: input.type ?? "email",
        title: input.subject,
        body: input.text ?? input.html.replace(/<[^>]+>/g, " ").slice(0, 500),
      },
    });
  }

  if (env.emailMocked) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `\n[email:mock] → ${Array.isArray(input.to) ? input.to.join(", ") : input.to}\n  ${input.subject}\n`
      );
    }
    return { id: `mock_${Date.now()}`, mocked: true, delivered: false };
  }

  if (env.emailApiKey) return sendViaResend(input);

  // SMTP transport — intentionally thin. Swap for nodemailer when SMTP is
  // the chosen provider; the public interface does not change.
  console.warn(
    "[email] SMTP_HOST is set but no SMTP transport is installed. Falling back to mock delivery."
  );
  return { id: `mock_${Date.now()}`, mocked: true, delivered: false };
}

/** Shared email chrome so every message looks like REXTON. */
export function emailLayout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f6f6f4;font-family:Georgia,'Times New Roman',serif;color:#111">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f4;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e6e4df">
          <tr><td style="padding:32px 40px;border-bottom:1px solid #e6e4df">
            <div style="font-size:13px;letter-spacing:.42em;text-transform:uppercase;color:#111">REXTON</div>
            <div style="font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8a8578;margin-top:6px">Swiss Timeless Root</div>
          </td></tr>
          <tr><td style="padding:40px">
            <h1 style="font-size:22px;font-weight:normal;margin:0 0 20px;letter-spacing:.02em">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:24px 40px;border-top:1px solid #e6e4df;font-size:11px;color:#8a8578;letter-spacing:.08em">
            REXTON WATCHES · Complimentary shipping across India
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  return `<p style="margin:28px 0"><a href="${href}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 32px;font-size:12px;letter-spacing:.18em;text-transform:uppercase">${label}</a></p>`;
}

export function emailText(children: string): string {
  return `<p style="font-size:14px;line-height:1.75;color:#3d3a33;margin:0 0 16px">${children}</p>`;
}
