import type { Metadata, Viewport } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: "REXTON Watches — Swiss Timeless Root",
    template: "%s · REXTON Watches",
  },
  description:
    "REXTON crafts premium Swiss-inspired timepieces for those who value every second. Explore chronographs, automatics and limited editions with complimentary shipping across India.",
  keywords: [
    "REXTON",
    "luxury watches India",
    "Swiss inspired watches",
    "automatic watches",
    "chronograph watches",
    "premium timepieces",
  ],
  openGraph: {
    type: "website",
    siteName: "REXTON WATCHES",
    title: "REXTON Watches — Swiss Timeless Root",
    description:
      "Swiss-inspired precision. Crafted for those who value every second.",
    url: env.appUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "REXTON Watches — Swiss Timeless Root",
    description:
      "Swiss-inspired precision. Crafted for those who value every second.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fdfdfc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${bodoni.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="bottom-right" theme="light" richColors />
      </body>
    </html>
  );
}
