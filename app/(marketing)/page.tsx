import type { Metadata } from 'next'

import HeroSection from '@/components/marketing/HeroSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import CreatorsSection from '@/components/marketing/CreatorsSection'
import EconomySection from '@/components/marketing/EconomySection'
import CTASection from '@/components/marketing/CTASection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'

export const metadata: Metadata = {
  title: '相逢 Xiangfeng - 深度思考者社区 | 知识创作与分享平台',
  description: '相逢是一个连接深度思考者的知识社区，打破认知边界，构建思维网络与知识经济生态。在这里发现高质量内容，结识志同道合的创作者，参与深度讨论，共建知识共享平台。',
  keywords: [
    '知识社区',
    '深度思考',
    '内容创作',
    '创作者经济',
    '认知网络',
    'Web3社交',
    '知识分享平台',
    '深度阅读',
    '优质内容',
    '创作者平台',
    '知识变现',
    '思维碰撞',
    '深度文章',
    '独立思考',
    '知识图谱'
  ],
  openGraph: {
    title: '相逢 Xiangfeng - 深度思考者社区',
    description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。发现深度内容，结识志同道合的创作者。',
    url: siteUrl,
    siteName: '相逢 Xiangfeng',
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CreatorsSection />
      <EconomySection />
      <CTASection />
    </>
  )
}
