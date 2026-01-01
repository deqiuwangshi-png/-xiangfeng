/**
 * 官网着陆页
 * 基于官网首页.html设计
 */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-xf-bg via-xf-surface to-xf-soft">
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full glass z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-xf-primary">相风创作</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-xf-dark hover:text-xf-primary px-3 py-2 rounded-md text-sm font-medium">
                  特色功能
                </a>
                <a href="#workflow" className="text-xf-dark hover:text-xf-primary px-3 py-2 rounded-md text-sm font-medium">
                  运作流程
                </a>
                <a href="#community" className="text-xf-dark hover:text-xf-primary px-3 py-2 rounded-md text-sm font-medium">
                  社群展示
                </a>
                <a href="/login" className="btn-primary">
                  开始使用
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-xf-dark mb-6 animate-fade-in">
            创作，让思想
            <span className="text-gradient">自由飞翔</span>
          </h2>
          <p className="text-xl text-xf-medium mb-8 max-w-3xl mx-auto animate-fade-in delay-200">
            相风创作是一个综合性的内容创作与社交平台，为创作者提供优雅的写作环境，为读者带来优质的阅读体验。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <a href="/login" className="btn-primary text-lg px-8 py-3">
              开始创作
            </a>
            <a href="#features" className="btn-secondary text-lg px-8 py-3">
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section id="features" className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-xf-dark mb-4">特色功能</h3>
            <p className="text-lg text-xf-medium">为创作者量身打造的强大功能</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card card-hover">
              <div className="text-xf-primary mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v6a4 4 0 01-4 4H6a4 4 0 01-4-4V7a4 4 0 014-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-xf-dark mb-2">优雅编辑器</h4>
              <p className="text-xf-medium">简洁优雅的写作界面，让创作成为一种享受</p>
            </div>
            <div className="card card-hover">
              <div className="text-xf-accent mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-xf-dark mb-2">智能推荐</h4>
              <p className="text-xf-medium">基于兴趣的内容推荐，发现更多优质文章</p>
            </div>
            <div className="card card-hover">
              <div className="text-xf-info mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-xf-dark mb-2">社区互动</h4>
              <p className="text-xf-medium">活跃的创作者社区，交流想法，共同成长</p>
            </div>
          </div>
        </div>
      </section>

      {/* 运作流程 */}
      <section id="workflow" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-xf-dark mb-4">运作流程</h3>
            <p className="text-lg text-xf-medium">简单三步，开启创作之旅</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-xf-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float">
                1
              </div>
              <h4 className="text-xl font-semibold text-xf-dark mb-2">注册账号</h4>
              <p className="text-xf-medium">快速注册，开启创作之旅</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-xf-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float delay-200">
                2
              </div>
              <h4 className="text-xl font-semibold text-xf-dark mb-2">创作内容</h4>
              <p className="text-xf-medium">使用优雅编辑器创作优质内容</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-xf-info rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float delay-400">
                3
              </div>
              <h4 className="text-xl font-semibold text-xf-dark mb-2">分享互动</h4>
              <p className="text-xf-medium">与社区分享，获得反馈和成长</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-xf-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">相风创作</h5>
              <p className="text-xf-medium">让创作成为一种享受</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">产品</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-xf-medium hover:text-white">功能介绍</a></li>
                <li><a href="#" className="text-xf-medium hover:text-white">定价方案</a></li>
                <li><a href="#" className="text-xf-medium hover:text-white">更新日志</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">支持</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-xf-medium hover:text-white">帮助中心</a></li>
                <li><a href="/privacy" className="text-xf-medium hover:text-white">隐私政策</a></li>
                <li><a href="/terms" className="text-xf-medium hover:text-white">服务条款</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">社区</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-xf-medium hover:text-white">博客</a></li>
                <li><a href="#" className="text-xf-medium hover:text-white">开发者</a></li>
                <li><a href="#" className="text-xf-medium hover:text-white">联系我们</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-xf-medium mt-8 pt-8 text-center">
            <p className="text-xf-medium">&copy; 2026 相风创作. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}