import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";


export const metadata: Metadata = {
  title: "相逢 Xiangfeng - 不止相遇，更是改变",
  description: "连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。",
  keywords: "知识社区, 深度思考, 认知网络, 创作者经济, Web3社交",
};

/**
 * 根布局组件
 * @param children - 子组件
 * @returns 根布局JSX
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth" data-scroll-behavior="smooth">
    <meta name="msvalidate.01" content="2C8C448F5364105CE31A05CCB3994092" />
    <meta name="google-site-verification" content="OnmNwulVS1xwiFr3pKL54p_0qTpoHRsi63cLm9cC8i4" />
      {/*
        @体验修复 U-02: 使用系统字体栈
        - 通过 CSS 变量定义字体族
        - 优先使用系统自带中文字体，无需网络下载
      */}
      <body className={`font-serif antialiased`}>
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
