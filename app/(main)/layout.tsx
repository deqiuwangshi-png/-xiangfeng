import { headers } from 'next/headers'
import { getCurrentUserWithProfile } from '@/lib/auth/server'
import { AppShell } from '@/components/app'
import { AuthRequiredContent } from '@/components/auth'
import { routeRequiresAuth } from '@/config/navigation'
import '@/styles/app.css'
import '@/styles/user.css'
import '@/styles/inbox.css'
import '@/styles/publish.css'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const profile = await getCurrentUserWithProfile()

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('next-url') || ''

  const isAuthRequired = routeRequiresAuth(pathname)

  if (isAuthRequired && !profile) {
    return (
      <AppShell>
        <AuthRequiredContent
          title="需要登录"
          description="登录后即可访问此页面"
        />
      </AppShell>
    )
  }

  return (
    <AppShell>{children}</AppShell>
  )
}
