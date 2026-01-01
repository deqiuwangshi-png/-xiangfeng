/**
 * 主应用布局文件
 * 为所有主应用页面提供统一的布局结构
 */

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-xf-bg">
      {/* 主应用头部导航 */}
      <header className="bg-white shadow-sm border-b border-xf-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-xf-dark">香枫</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/dashboard" className="text-xf-medium hover:text-xf-primary">
                仪表板
              </a>
              <a href="/articles" className="text-xf-medium hover:text-xf-primary">
                文章
              </a>
              <a href="/discussions" className="text-xf-medium hover:text-xf-primary">
                讨论
              </a>
              <a href="/profile" className="text-xf-medium hover:text-xf-primary">
                个人资料
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}