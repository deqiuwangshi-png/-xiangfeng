import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUserWithProfile } from '@/lib/auth/server'
import { AppShell } from '@/components/app'
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
    redirect('/')
  }

  return (
    <AppShell>{children}</AppShell>
  )
}
