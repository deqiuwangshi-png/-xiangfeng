import type { Metadata } from 'next'

import HeroSection from '@/components/marketing/HeroSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import CreatorsSection from '@/components/marketing/CreatorsSection'
import EconomySection from '@/components/marketing/EconomySection'
import CTASection from '@/components/marketing/CTASection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'

export const metadata: Metadata = {
  title: '相逢 Xiangfeng - 不止相遇，更是改变',
  description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。在相逢，发现深度内容，结识志同道合的创作者。',
  keywords: ['知识社区', '深度思考', '内容创作', '创作者经济', '认知网络', 'Web3社交', '知识分享平台'],
  openGraph: {
    title: '相逢 Xiangfeng - 不止相遇，更是改变',
    description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
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
