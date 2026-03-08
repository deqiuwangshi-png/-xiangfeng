import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { SWRProvider } from "@/components/providers/SWRProvider";
import "./globals.css";

/**
 * 无衬线字体配置 - 用于正文和UI元素
 * @description 使用next/font优化加载性能，支持font-display: swap
 * 
 * 优化策略：
 * - 不指定subsets，让Next.js自动处理（中文没有子集）
 * - 使用system font stack作为后备，确保首屏立即渲染
 * - 启用preload优先加载关键字体
 * - 添加size-adjust减少CLS
 */
const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
  // 定义后备字体栈：优先使用系统字体，避免FOIT
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "PingFang SC",
    "Microsoft YaHei",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  // 调整大小比例，使后备字体和Noto Sans SC更匹配
  adjustFontFallback: true,
});

/**
 * 衬线字体配置 - 用于标题和强调文本
 * @description 这是LCP关键字体，需要优先加载
 * 
 * 优化策略：
 * - 仅加载标题需要的字重（500, 700），400由无衬线字体承担
 * - 添加系统衬线字体作为后备
 */
const notoSerifSC = Noto_Serif_SC({
  weight: ["500", "700"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
  fallback: [
    "PingFang SC",
    "STSong",
    "SimSun",
    "Songti SC",
    "Apple LiSung",
    "Georgia",
    "serif",
  ],
  adjustFontFallback: true,
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
        </SWRProvider>
      </body>
    </html>
  );
}
