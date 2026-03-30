import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

/**
 * 营销页面布局
 * @description 不包含metadata，由各子页面自行定义
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </div>
  )
}
