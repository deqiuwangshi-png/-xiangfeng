import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site';
const siteName = '相逢 Xiangfeng';

export const viewport: Viewport = {
  themeColor: '#3A3C6E',
  width: 'device-width',
  initialScale: 1,
};

/**
 * 全局Metadata配置
 * @description 简化的SEO配置，适合中小项目
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - 深度思考者社区`,
    template: `%s | ${siteName}`,
  },
  description: "相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。",
  keywords: ["知识社区", "深度思考", "长文创作", "深度阅读", "内容创作"],

  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },

  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: siteName,
    images: [`${siteUrl}/og-image.svg`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

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
