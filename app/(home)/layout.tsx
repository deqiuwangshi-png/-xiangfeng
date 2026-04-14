import { AppShell } from '@/components/app'
import '@/styles/app.css'
import '@/styles/user.css'

/**
 * Home布局 - 首页专用布局（公开访问）
 */
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <AppShell>{children}</AppShell>
  )
}
