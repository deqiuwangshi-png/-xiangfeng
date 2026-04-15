'use client';

/**
 * 认证守卫组件（简化版）
 * @module components/auth/AuthGuard
 */

import { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { useAuthContext } from '@/components/providers/AuthProvider';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, authState, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xf-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-xf-bg">
      <Sidebar user={user} profile={profile} authState={authState} />
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
