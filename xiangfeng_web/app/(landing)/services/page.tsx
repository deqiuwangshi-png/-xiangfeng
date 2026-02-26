/**
 * 服务页面
 * 展示平台提供的各项服务
 */

export default function ServicesPage() {
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
              <a href="/about" className="text-xf-medium hover:text-xf-primary">关于我们</a>
              <a href="/services" className="text-xf-primary font-medium">服务</a>
              <a href="/community" className="text-xf-medium hover:text-xf-primary">社区</a>
              <a href="/login" className="bg-xf-primary text-white px-4 py-2 rounded-lg hover:bg-xf-primary/90">
                登录
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-xf-dark mb-4">我们的服务</h1>
            <p className="text-xl text-xf-medium">为中文创作者提供全方位的支持</p>
          </div>

          {/* 核心服务 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">📝</div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">内容创作</h3>
              <p className="text-xf-medium mb-4">
                提供优雅的编辑器，支持 Markdown 和富文本编辑，让您的创作过程更加流畅。
              </p>
              <ul className="text-sm text-xf-medium space-y-1">
                <li>• 实时预览和自动保存</li>
                <li>• 支持代码高亮和数学公式</li>
                <li>• 多媒体内容嵌入</li>
                <li>• 版本历史记录</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">🌐</div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">全球发布</h3>
              <p className="text-xf-medium mb-4">
                一键发布到全球，通过 CDN 加速确保您的内容能够快速触达世界各地的读者。
              </p>
              <ul className="text-sm text-xf-medium space-y-1">
                <li>• 自动 SEO 优化</li>
                <li>• 社交媒体分享</li>
                <li>• 自定义域名支持</li>
                <li>• 访问统计分析</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">👥</div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">社区互动</h3>
              <p className="text-xf-medium mb-4">
                连接全球中文创作者，通过评论、讨论和协作建立有意义的联系。
              </p>
              <ul className="text-sm text-xf-medium space-y-1">
                <li>• 实时评论系统</li>
                <li>• 专题讨论区</li>
                <li>• 创作者关注</li>
                <li>• 私信功能</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">数据分析</h3>
              <p className="text-xf-medium mb-4">
                详细的阅读数据分析，帮助您了解内容表现，优化创作策略。
              </p>
              <ul className="text-sm text-xf-medium space-y-1">
                <li>• 阅读量统计</li>
                <li>• 读者画像分析</li>
                <li>• 热门内容排行</li>
                <li>• 趋势预测</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">🔒</div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">内容保护</h3>
              <p className="text-xf-medium mb-4">
                多重安全措施保护您的原创内容，防止未经授权的复制和传播。
              </p>
              <ul className="text-sm text-xf-medium space-y-1">
                <li>• 版权保护声明</li>
                <li>• 内容水印</li>
                <li>• 访问权限控制</li>
                <li>• 侵权监测</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">🎨</div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">个性化定制</h3>
              <p className="text-xf-medium mb-4">
                丰富的主题和布局选项，让您的创作空间展现个人风格。
              </p>
              <ul className="text-sm text-xf-medium space-y-1">
                <li>• 多种主题模板</li>
                <li>• 自定义配色方案</li>
                <li>• 个人主页定制</li>
                <li>• 品牌标识设置</li>
              </ul>
            </div>
          </div>

          {/* 服务流程 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-xf-dark mb-8 text-center">服务流程</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-xf-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">1</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-2">注册账户</h3>
                <p className="text-sm text-xf-medium">创建您的创作者账户</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-xf-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">2</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-2">创作内容</h3>
                <p className="text-sm text-xf-medium">使用我们的编辑器创作</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-xf-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">3</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-2">发布分享</h3>
                <p className="text-sm text-xf-medium">一键发布到全球</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">4</span>
                </div>
                <h3 className="font-semibold text-xf-dark mb-2">互动成长</h3>
                <p className="text-sm text-xf-medium">与读者和创作者互动</p>
              </div>
            </div>
          </div>

          {/* 定价方案 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-xf-dark mb-4">定价方案</h2>
            <p className="text-xf-medium">选择适合您的服务计划</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-xf-primary transition-colors">
              <h3 className="text-xl font-bold text-xf-dark mb-2">免费版</h3>
              <div className="text-3xl font-bold text-xf-primary mb-4">¥0</div>
              <ul className="text-sm text-xf-medium space-y-2 mb-6">
                <li>✓ 基础创作功能</li>
                <li>✓ 无限文章发布</li>
                <li>✓ 基础统计分析</li>
                <li>✓ 社区互动</li>
              </ul>
              <button className="w-full bg-xf-light text-xf-dark py-2 rounded-lg hover:bg-xf-light/80">
                开始使用
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-xf-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-xf-primary text-white px-3 py-1 rounded-full text-sm">
                推荐
              </div>
              <h3 className="text-xl font-bold text-xf-dark mb-2">专业版</h3>
              <div className="text-3xl font-bold text-xf-primary mb-4">¥29<span className="text-lg">/月</span></div>
              <ul className="text-sm text-xf-medium space-y-2 mb-6">
                <li>✓ 所有免费版功能</li>
                <li>✓ 高级主题模板</li>
                <li>✓ 详细数据分析</li>
                <li>✓ 自定义域名</li>
                <li>✓ 优先技术支持</li>
              </ul>
              <button className="w-full bg-xf-primary text-white py-2 rounded-lg hover:bg-xf-primary/90">
                升级专业版
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-xf-primary transition-colors">
              <h3 className="text-xl font-bold text-xf-dark mb-2">企业版</h3>
              <div className="text-3xl font-bold text-xf-primary mb-4">¥99<span className="text-lg">/月</span></div>
              <ul className="text-sm text-xf-medium space-y-2 mb-6">
                <li>✓ 所有专业版功能</li>
                <li>✓ 团队协作功能</li>
                <li>✓ 高级安全设置</li>
                <li>✓ API 访问</li>
                <li>✓ 专属客户经理</li>
              </ul>
              <button className="w-full bg-xf-light text-xf-dark py-2 rounded-lg hover:bg-xf-light/80">
                联系销售
              </button>
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