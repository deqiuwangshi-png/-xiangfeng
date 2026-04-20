import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/server'
import { isSuperAdmin } from '@/lib/admin/utils'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const allowed = await isSuperAdmin(user.id)
  if (!allowed) {
    notFound()
  }

  return <>{children}</>
}

