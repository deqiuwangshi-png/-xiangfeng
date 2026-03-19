import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'
const siteName = '相逢 Xiangfeng'

// 分离 viewport 配置（Next.js 14+ 推荐）
export const viewport: Viewport = {
  themeColor: '#3A3C6E',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - 不止相遇，更是改变`,
    template: `%s | ${siteName}`,
  },
  description: "连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。",
  keywords: ["知识社区", "深度思考", "认知网络", "创作者经济", "Web3社交", "内容创作", "知识分享"],
  authors: [{ name: 'Xiangfeng Team' }],
  creator: 'Xiangfeng Team',
  publisher: 'Xiangfeng',
  
  //添加 favicon 配置
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    // 可选：苹果设备图标
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  // 移除手动写的 meta 标签，改用 metadata API
  verification: {
    google: 'OnmNwulVS1xwiFr3pKL54p_0qTpoHRsi63cLm9cC8i4',
    other: {
      'msvalidate.01': '2C8C448F5364105CE31A05CCB3994092',
    },
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - 不止相遇，更是改变`,
    description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: '相逢 Xiangfeng - 知识社区',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - 不止相遇，更是改变`,
    description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
    images: [`${siteUrl}/og-image.svg`],
    creator: '@xiangfeng',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      {/* 
        修复：移除了错误的 <meta> 标签放置
        这些已经通过 metadata API 自动注入到 <head> 中
        不需要手动写在这里
      */}
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