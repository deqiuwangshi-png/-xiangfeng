import { AppShell } from '@/components/app'
import '@/styles/app.css'
import '@/styles/user.css'
import '@/styles/inbox.css'
import '@/styles/publish.css'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <AppShell>{children}</AppShell>
  )
}
