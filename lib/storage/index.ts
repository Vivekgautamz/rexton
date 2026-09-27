import "server-only";
import { createHash } from "crypto";
import { env } from "@/lib/env";

/**
 * Image storage.
 *
 * Cloudinary when CLOUDINARY_CLOUD_NAME is present; otherwise local
 * `/public/uploads` handling so the admin panel can still be exercised.
 * Secrets stay server-side — the browser only ever receives a public URL or a
 * signed upload payload.
 */

export interface SignedUpload {
  url: string;
  fields: Record<string, string>;
  /** Public URL to use once the upload finishes. */
  deliveryUrl: string;
  mocked: boolean;
}

export function isCloudinaryConfigured(): boolean {
  return !env.storageMocked;
}

export function getUploadSignature(folder = "rexton/products"): SignedUpload {
  if (env.storageMocked) {
    return {
      url: "/api/admin/uploads",
      fields: { folder },
      deliveryUrl: "",
      mocked: true,
    };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  return {
    url: `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`,
    fields: {
      api_key: env.cloudinaryApiKey,
      timestamp: String(timestamp),
      folder,
      signature,
    },
    deliveryUrl: `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload`,
    mocked: false,
  };
}

/** Normalises stored image paths into something <Image> can render. */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/placeholder-watch.svg";
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}
