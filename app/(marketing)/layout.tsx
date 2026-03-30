import type { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: '相逢 Xiangfeng - 不止相遇，更是改变',
  description: '为体系化知识而来，为长期成长与长期收益相遇',
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
