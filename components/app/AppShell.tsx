'use client'

import { AuthGuard } from '@/components/auth/guards/AuthGuard'
import { AuthProvider } from '@/components/providers'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  )
}
