import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

const isDev = process.env.NODE_ENV === "development";

export const viewport: Viewport = {
  themeColor: '#3A3C6E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="font-serif antialiased">
        <SWRProvider>
          {children}
          <ToastProvider />
        </SWRProvider>
        {!isDev && <Analytics />}
        {!isDev && <SpeedInsights />}
      </body>
    </html>
  );
}
