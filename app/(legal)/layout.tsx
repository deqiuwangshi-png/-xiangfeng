import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '相逢 Xiangfeng - 不止相遇，更是改变',
  description: '连接深度思考者，打破认知边界，构建属于你的思维网络与知识经济生态。',
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
