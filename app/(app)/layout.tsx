import { Sidebar } from '@/components/ui/Sidebar'
import '@/styles/domains/app.css'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full max-w-[1600px] mx-auto bg-xf-light overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative scroll-smooth">
        {children}
      </main>
    </div>
  )
}
