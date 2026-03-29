import type { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: '相逢 Xiangfeng - 不止相遇，更是改变',
  description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
  keywords: '知识社区, 深度思考, 认知网络, 创作者经济, Web3社交',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </div>
  )
}
