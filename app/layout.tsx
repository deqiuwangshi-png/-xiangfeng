import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

/**
 * 无衬线字体配置 - 用于正文和UI元素
 */
const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

/**
 * 衬线字体配置 - 用于标题和强调文本
 */
const notoSerifSC = Noto_Serif_SC({
  weight: ["500", "700"],
  variable: "--font-serif",
});

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
      <body className={`${notoSansSC.variable} ${notoSerifSC.variable} antialiased`}>
        <SWRProvider>
          {children}
          <ToastProvider />
        </SWRProvider>
      </body>
    </html>
  );
}
