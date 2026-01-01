/**
 * 关于我们页面
 * 展示平台信息和团队介绍
 */

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xf-bg via-xf-surface to-xf-soft">
      {/* 页眉导航 */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-xf-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-xf-dark">香枫</h1>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-xf-medium hover:text-xf-primary">首页</a>
              <a href="/about" className="text-xf-primary font-medium">关于我们</a>
              <a href="/services" className="text-xf-medium hover:text-xf-primary">服务</a>
              <a href="/community" className="text-xf-medium hover:text-xf-primary">社区</a>
              <a href="/login" className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
                登录
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-xf-dark mb-4">关于香枫</h1>
            <p className="text-xl text-xf-medium">为中文创作者打造的优质内容平台</p>
          </div>

          {/* 平台介绍 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-xf-dark mb-4">我们的使命</h2>
            <p className="text-xf-dark leading-relaxed mb-4">
              香枫致力于为全球中文创作者提供一个优雅、高效的创作与分享平台。我们相信，每个人都有独特的故事和见解值得被世界听见。
            </p>
            <p className="text-xf-dark leading-relaxed">
              通过先进的技术和人性化的设计，我们希望降低创作门槛，让更多热爱写作的人能够专注于内容创作本身，而不必为技术细节所困扰。
            </p>
          </div>

          {/* 核心特性 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-xf-dark mb-2">优雅写作</h3>
              <p className="text-xf-medium">
                简洁的编辑器界面，支持 Markdown 和富文本编辑，让您专注于内容创作。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-xf-dark mb-2">全球可达</h3>
              <p className="text-xf-medium">
                优化的性能和全球 CDN 加速，确保您的内容能够快速触达世界各地的读者。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-xf-dark mb-2">活跃社区</h3>
              <p className="text-xf-medium">
                连接志同道合的创作者，通过评论、讨论和分享建立有意义的联系。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-xf-dark mb-2">数据安全</h3>
              <p className="text-xf-medium">
                采用业界标准的安全措施，保护您的创作内容和个人信息安全。
              </p>
            </div>
          </div>

          {/* 团队介绍 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-xf-dark mb-6">我们的团队</h2>
            <p className="text-xf-dark leading-relaxed mb-6">
              香枫由一群热爱技术和中文创作的开发者组成。我们深知中文创作者在全球化平台上面临的挑战，
              因此致力于打造一个真正为中文用户优化的创作环境。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-xf-light rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-1">技术团队</h3>
                <p className="text-sm text-xf-medium">专注于平台性能和用户体验优化</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-xf-light rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👩‍🎨</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-1">设计团队</h3>
                <p className="text-sm text-xf-medium">打造优雅直观的用户界面</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-xf-light rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-1">运营团队</h3>
                <p className="text-sm text-xf-medium">维护活跃的创作者社区</p>
              </div>
            </div>
          </div>

          {/* 联系我们 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-xf-dark mb-4">联系我们</h2>
            <p className="text-xf-dark leading-relaxed mb-6">
              如果您有任何问题、建议或合作意向，欢迎随时与我们联系。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <div>
                  <h3 className="font-semibold text-xf-dark">邮箱</h3>
                  <p className="text-xf-medium">contact@xiangfeng.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-xl">💬</span>
                <div>
                  <h3 className="font-semibold text-xf-dark">社区</h3>
                  <p className="text-xf-medium">加入我们的 Discord 社区</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-xf-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">香枫</h3>
            <p className="text-gray-300 mb-6">为中文创作者而生</p>
            <div className="flex justify-center space-x-6">
              <a href="/privacy" className="text-gray-300 hover:text-white">隐私政策</a>
              <a href="/terms" className="text-gray-300 hover:text-white">服务条款</a>
              <a href="/community" className="text-gray-300 hover:text-white">社区</a>
              <a href="/login" className="text-gray-300 hover:text-white">登录</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}