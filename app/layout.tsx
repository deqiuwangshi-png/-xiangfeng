import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/seo";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'
const siteName = '相逢 Xiangfeng'

export const viewport: Viewport = {
  themeColor: '#3A3C6E',
  width: 'device-width',
  initialScale: 1,
}

/**
 * 站点元数据配置 - SEO核心优化
 * @description 全面优化搜索引擎可见性和社交分享体验
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - 深度思考者社区 | 长文创作与知识分享平台`,
    template: `%s | ${siteName}`,
  },
  description: "相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。打破认知边界，构建思维网络与知识经济生态，让深度内容回归本真。",
  keywords: [
    "知识社区", "深度思考", "长文创作", "深度阅读", "认知网络",
    "创作者经济", "Web3社交", "内容创作", "知识分享", "优质内容",
    "独立思考", "思维碰撞", "知识变现", "创作者平台", "深度文章",
    "知识图谱", "内容聚合", "精神家园", "认知升级", "价值共创"
  ],
  authors: [{ name: 'Xiangfeng Team', url: `${siteUrl}/about` }],
  creator: 'Xiangfeng Team',
  publisher: 'Xiangfeng',
  
  /**
   * 图标配置 - 支持多平台
   */
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  
  manifest: '/site.webmanifest',
  
  /**
   * 搜索引擎验证配置
   */
  verification: {
    google: 'OnmNwulVS1xwiFr3pKL54p_0qTpoHRsi63cLm9cC8i4',
    other: {
      'msvalidate.01': '2C8C448F5364105CE31A05CCB3994092',
      'baidu-site-verification': 'codeva-example',
    },
  },
  
  /**
   * 机器人控制 - 优化索引策略
   */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  /**
   * Open Graph - 社交分享优化
   */
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - 深度思考者社区 | 长文创作与知识分享平台`,
    description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。打破认知边界，构建思维网络与知识经济生态。',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: '相逢 Xiangfeng - 深度思考者社区与知识分享平台',
        type: 'image/svg+xml',
      },
    ],
  },
  
  /**
   * Twitter Card - Twitter分享优化
   */
  twitter: {
    card: 'summary_large_image',
    site: '@xiangfeng',
    title: `${siteName} - 深度思考者社区 | 长文创作与知识分享平台`,
    description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。',
    images: [`${siteUrl}/og-image.svg`],
    creator: '@xiangfeng',
  },
  
  /**
   * 其他元数据
   */
  alternates: {
    canonical: siteUrl,
    languages: {
      'zh-CN': siteUrl,
    },
  },
  category: 'technology',
  classification: '知识社区,内容创作,社交网络',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  
  /**
   * Apple设备优化
   */
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: 'black-translucent',
  },
  
  /**
   * 应用信息
   */
  applicationName: siteName,
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* 结构化数据标记 - Schema.org */}
        <WebsiteStructuredData />
        <OrganizationStructuredData />
      </head>
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