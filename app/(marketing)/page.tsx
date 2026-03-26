import type { Metadata } from 'next'

import HeroSection from '@/components/marketing/HeroSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import CreatorsSection from '@/components/marketing/CreatorsSection'
import EconomySection from '@/components/marketing/EconomySection'
import CTASection from '@/components/marketing/CTASection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xiangfeng.site'
const siteName = '相逢 Xiangfeng'

/**
 * 首页SEO元数据 - 核心着陆页优化
 * @description 针对搜索引擎和社交分享进行全面优化
 */
export const metadata: Metadata = {
  title: `${siteName} - 深度思考者社区 | 长文创作与知识分享平台`,
  description: '相逢是一个连接深度思考者的知识社区，专注于长文创作与深度阅读。打破认知边界，构建思维网络与知识经济生态。在这里发现高质量深度内容，结识志同道合的创作者，参与有价值的深度讨论。',
  keywords: [
    '知识社区', '深度思考', '长文创作', '深度阅读', '内容创作',
    '创作者经济', '认知网络', 'Web3社交', '知识分享平台',
    '优质内容', '创作者平台', '知识变现', '思维碰撞',
    '深度文章', '独立思考', '知识图谱', '精神家园',
    '价值共创', '内容聚合', '认知升级', '深度连接'
  ],
  
  /**
   * Open Graph - 社交分享优化
   */
  openGraph: {
    title: `${siteName} - 深度思考者社区 | 长文创作与知识分享平台`,
    description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。发现深度内容，结识志同道合的创作者。',
    url: siteUrl,
    siteName: siteName,
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: '相逢 Xiangfeng - 深度思考者社区与知识分享平台',
      },
    ],
  },
  
  /**
   * Twitter Card
   */
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - 深度思考者社区`,
    description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
    images: [`${siteUrl}/og-image.svg`],
  },
  
  /**
   * 规范链接和替代版本
   */
  alternates: {
    canonical: siteUrl,
    languages: {
      'zh-CN': siteUrl,
    },
  },
  
  /**
   * 机器人控制
   */
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
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
