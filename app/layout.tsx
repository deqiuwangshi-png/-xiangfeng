import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

/**
 * 视口配置
 * @description 移动端适配配置
 */
export const viewport: Viewport = {
  themeColor: '#3A3C6E',
  width: 'device-width',
  initialScale: 1,
};

/**
 * 全局Metadata配置
 * @description 使用统一SEO配置，避免重复定义
 * @see @/lib/seo/config.ts
 */
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
