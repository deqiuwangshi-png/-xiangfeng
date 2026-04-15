import { AuthProvider } from '@/components/providers'

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
