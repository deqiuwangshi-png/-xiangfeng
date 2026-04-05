import { createMetadata } from '@/lib/seo'

/**
 * 法律页面布局Metadata
 * @description 使用统一SEO配置
 */
export const metadata = createMetadata({
  title: '法律信息',
  description: '连接全球思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
})

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
