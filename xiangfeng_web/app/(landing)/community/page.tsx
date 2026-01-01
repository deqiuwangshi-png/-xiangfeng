/**
 * 社区页面
 * 展示社区动态和热门话题
 */

export default function CommunityPage() {
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
              <a href="/services" className="text-xf-medium hover:text-xf-primary">服务</a>
              <a href="/community" className="text-xf-primary font-medium">社区</a>
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
            <h1 className="text-4xl font-bold text-xf-dark mb-4">香枫社区</h1>
            <p className="text-xl text-xf-medium">连接全球中文创作者</p>
          </div>

          {/* 社区统计数据 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-xf-primary mb-2">10K+</div>
              <div className="text-xf-medium">创作者</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-xf-secondary mb-2">50K+</div>
              <div className="text-xf-medium">文章</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-xf-accent mb-2">100K+</div>
              <div className="text-xf-medium">讨论</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">500K+</div>
              <div className="text-xf-medium">月访问</div>
            </div>
          </div>

          {/* 社区板块 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* 热门讨论 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-xf-dark">热门讨论</h2>
                  <button className="text-xf-primary hover:text-xf-accent text-sm">
                    查看更多
                  </button>
                </div>
                
                {/* 讨论列表 */}
                <div className="space-y-4">
                  <div className="border border-xf-soft rounded-lg p-4 hover:bg-xf-light cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xf-dark mb-1">如何提升写作效率？</h3>
                        <p className="text-sm text-xf-medium mb-2">分享一些实用的写作技巧和方法，帮助大家提高创作效率...</p>
                        <div className="flex items-center space-x-4 text-xs text-xf-medium">
                          <span>技术讨论</span>
                          <span>•</span>
                          <span>128 回复</span>
                          <span>•</span>
                          <span>2 小时前</span>
                        </div>
                      </div>
                      <div className="text-xl">🔥</div>
                    </div>
                  </div>
                  
                  <div className="border border-xf-soft rounded-lg p-4 hover:bg-xf-light cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xf-dark mb-1">新手创作者入门指南</h3>
                        <p className="text-sm text-xf-medium mb-2">为刚开始创作的朋友们提供一些建议和指导...</p>
                        <div className="flex items-center space-x-4 text-xs text-xf-medium">
                          <span>创作分享</span>
                          <span>•</span>
                          <span>89 回复</span>
                          <span>•</span>
                          <span>5 小时前</span>
                        </div>
                      </div>
                      <div className="text-xl">📚</div>
                    </div>
                  </div>
                  
                  <div className="border border-xf-soft rounded-lg p-4 hover:bg-xf-light cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xf-dark mb-1">平台功能建议征集</h3>
                        <p className="text-sm text-xf-medium mb-2">欢迎大家提出对平台功能的建议和想法...</p>
                        <div className="flex items-center space-x-4 text-xs text-xf-medium">
                          <span>意见建议</span>
                          <span>•</span>
                          <span>56 回复</span>
                          <span>•</span>
                          <span>1 天前</span>
                        </div>
                      </div>
                      <div className="text-xl">💡</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最新文章 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-xf-dark">最新文章</h2>
                  <button className="text-xf-primary hover:text-xf-accent text-sm">
                    查看更多
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 hover:bg-xf-light rounded-lg cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-xf-light rounded-lg flex items-center justify-center">
                      <span className="text-xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xf-dark mb-1">我的第一篇技术博客</h3>
                      <p className="text-sm text-xf-medium mb-2">记录我在学习过程中的心得体会...</p>
                      <div className="flex items-center space-x-4 text-xs text-xf-medium">
                        <span>张三</span>
                        <span>•</span>
                        <span>3 小时前</span>
                        <span>•</span>
                        <span>256 阅读</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 hover:bg-xf-light rounded-lg cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-xf-light rounded-lg flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xf-dark mb-1">从零开始学习前端开发</h3>
                      <p className="text-sm text-xf-medium mb-2">分享我的前端学习路线和经验...</p>
                      <div className="flex items-center space-x-4 text-xs text-xf-medium">
                        <span>李四</span>
                        <span>•</span>
                        <span>5 小时前</span>
                        <span>•</span>
                        <span>189 阅读</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 发起讨论 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-xf-dark mb-4">发起讨论</h3>
                <p className="text-xf-medium text-sm mb-4">分享您的想法，与社区成员交流</p>
                <button className="w-full bg-xf-primary text-white py-2 rounded-lg hover:bg-xf-primary/90">
                  发起新讨论
                </button>
              </div>

              {/* 热门标签 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-xf-dark mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-xf-light text-xf-dark rounded-full text-sm">技术分享</span>
                  <span className="px-3 py-1 bg-xf-light text-xf-dark rounded-full text-sm">创作心得</span>
                  <span className="px-3 py-1 bg-xf-light text-xf-dark rounded-full text-sm">生活感悟</span>
                  <span className="px-3 py-1 bg-xf-light text-xf-dark rounded-full text-sm">学习笔记</span>
                  <span className="px-3 py-1 bg-xf-light text-xf-dark rounded-full text-sm">项目展示</span>
                  <span className="px-3 py-1 bg-xf-light text-xf-dark rounded-full text-sm">求助问答</span>
                </div>
              </div>

              {/* 社区规则 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">社区规则</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• 保持友善和尊重</li>
                  <li>• 分享有价值的内容</li>
                  <li>• 避免垃圾信息</li>
                  <li>• 尊重知识产权</li>
                  <li>• 遵守法律法规</li>
                </ul>
              </div>

              {/* 活跃用户 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-xf-dark mb-4">活跃用户</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-xf-light rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-xf-dark">创作者小王</div>
                      <div className="text-xs text-xf-medium">发布了 28 篇文章</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-xf-light rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-xf-dark">技术达人</div>
                      <div className="text-xs text-xf-medium">发布了 15 篇文章</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-xf-light rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-xf-dark">生活记录者</div>
                      <div className="text-xs text-xf-medium">发布了 12 篇文章</div>
                    </div>
                  </div>
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