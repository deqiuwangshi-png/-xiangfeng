/**
 * 官网着陆页
 * 基于官网首页.html设计
 */

'use client';

import { GitMerge, Menu, Brain, Users, Sword, Calendar, Check, X, Twitter, Instagram, Github } from 'lucide-react';

export default function LandingPage() {
  // 移动端菜单切换函数
  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  };

  return (
    <div id="landing-view" className="min-h-screen flex flex-col bg-xf-light text-xf-dark antialiased font-sans selection-soft overflow-x-hidden">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 w-full glass border-b border-xf-bg/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo - 已添加图标 */}
          <div className="flex items-center gap-3">
            <div className="logo-icon w-8 h-8 bg-gradient-to-tr from-xf-accent to-xf-primary rounded-lg flex items-center justify-center animate-logo-pulse">
              {/* 使用 "git-merge" 图标，象征连接和相遇 */}
              <GitMerge className="w-4.5 h-4.5 text-white lucide-icon" />
            </div>
            <span className="font-serif text-xl font-bold text-gradient">相逢</span>
          </div>

          {/* 桌面导航菜单 */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="nav-active-indicator text-xf-primary hover:text-xf-accent font-medium transition-colors">特色功能</a>
            <a href="#how-it-works" className="nav-active-indicator text-xf-primary hover:text-xf-accent font-medium transition-colors">如何运作</a>
            <a href="#community" className="nav-active-indicator text-xf-primary hover:text-xf-accent font-medium transition-colors">社群</a>
            <a href="#pricing" className="nav-active-indicator text-xf-primary hover:text-xf-accent font-medium transition-colors">定价</a>
          </div>

          {/* 行动按钮 */}
          <div className="flex items-center gap-4">
            <a href="/login" className="btn-primary px-6 py-2.5">
              登录
            </a>
            {/* 移动端菜单按钮 */}
            <button id="mobile-menu-btn" className="md:hidden text-xf-primary" onClick={toggleMobileMenu}>
              <Menu className="w-6 h-6 lucide-icon" />
            </button>
          </div>

          {/* 移动端菜单 */}
          <div id="mobile-menu" className="md:hidden hidden absolute top-full left-0 w-full glass-dark backdrop-blur-md border-b border-white/10 shadow-elevated">
            <div className="flex flex-col p-6 space-y-4">
              <a href="#features" className="text-white hover:text-xf-soft font-medium py-2" onClick={toggleMobileMenu}>特色功能</a>
              <a href="#how-it-works" className="text-white hover:text-xf-soft font-medium py-2" onClick={toggleMobileMenu}>如何运作</a>
              <a href="#community" className="text-white hover:text-xf-soft font-medium py-2" onClick={toggleMobileMenu}>社群</a>
              <a href="#pricing" className="text-white hover:text-xf-soft font-medium py-2" onClick={toggleMobileMenu}>定价</a>
              <div className="pt-4 border-t border-white/10">
                <a href="/login" className="w-full py-3 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md block text-center">
                  立即体验
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        {/* 背景装饰 */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-xf-soft/30 to-xf-primary/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-xf-surface/20 to-xf-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] grid-bg opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-xf-light/80 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-xf-info animate-pulse"></div>
              <span className="text-sm font-medium text-xf-primary">深度思考者的精神家园</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-fade-in" style={{animationDelay: "0.1s"}}>
              <span className="text-xf-accent">不止相遇</span>
              <span className="block mt-2 text-xf-dark">更是<span className="text-gradient">改变</span></span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-xf-medium mb-10 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
              连接深度思考者，打破认知边界，构建属于你的思维网络
            </p>

            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{animationDelay: "0.3s"}}>
              <a href="/login" className="btn-primary text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-98">
                开启深度之旅
              </a>
              <a href="#features" className="btn-secondary text-lg px-8 py-4 rounded-2xl">
                探索特色
              </a>
            </div>

            {/* 应用预览图 */}
            <div className="relative max-w-4xl mx-auto animate-scale-in" style={{animationDelay: "0.5s"}}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-xf-bg/50">
                <div className="absolute inset-0 bg-gradient-to-br from-xf-primary/5 to-xf-accent/5"></div>
                <div className="relative p-1 md:p-2 bg-white">
                  {/* 模拟应用界面 */}
                  <div className="bg-xf-light rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="logo-icon w-10 h-10 bg-gradient-to-tr from-xf-accent to-xf-primary rounded-xl flex items-center justify-center">
                            <GitMerge className="w-6 h-6 text-white lucide-icon" />
                          </div>
                          <div>
                            <div className="h-3 w-24 bg-xf-primary/30 rounded-full mb-2"></div>
                            <div className="h-2 w-16 bg-xf-medium/20 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-xf-bg"></div>
                          <div className="w-8 h-8 rounded-full bg-xf-bg"></div>
                        </div>
                      </div>
                       
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="h-32 bg-gradient-to-br from-xf-soft to-white rounded-xl p-4">
                          <div className="h-4 w-3/4 bg-xf-primary/20 rounded-full mb-3"></div>
                          <div className="h-2 w-full bg-xf-medium/10 rounded-full mb-2"></div>
                          <div className="h-2 w-2/3 bg-xf-medium/10 rounded-full"></div>
                        </div>
                        <div className="h-32 bg-gradient-to-br from-xf-surface to-white rounded-xl p-4">
                          <div className="h-4 w-3/4 bg-xf-accent/20 rounded-full mb-3"></div>
                          <div className="h-2 w-full bg-xf-medium/10 rounded-full mb-2"></div>
                          <div className="h-2 w-2/3 bg-xf-medium/10 rounded-full"></div>
                        </div>
                        <div className="h-32 bg-gradient-to-br from-xf-info/10 to-white rounded-xl p-4">
                          <div className="h-4 w-3/4 bg-xf-info/20 rounded-full mb-3"></div>
                          <div className="h-2 w-full bg-xf-medium/10 rounded-full mb-2"></div>
                          <div className="h-2 w-2/3 bg-xf-medium/10 rounded-full"></div>
                        </div>
                      </div>
                       
                      <div className="h-40 w-full bg-gradient-to-r from-xf-soft/40 to-xf-primary/20 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 装饰元素 */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-xf-soft/40 to-xf-primary/20 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-tr from-xf-surface/40 to-xf-accent/20 animate-float" style={{animationDelay: "1s"}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-xf-light/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">重新定义深度连接</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">相逢不仅是平台，更是思想碰撞与认知升级的催化剂</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 特色1 */}
            <div className="card">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xf-soft to-xf-info/30 flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-xf-info lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">认知星云</h3>
              <p className="text-xf-medium mb-6">可视化你的思维网络，连接不同领域的知识点，构建属于你的认知星系。</p>
              <div className="flex flex-wrap gap-2">
                <span className="tag">思维可视化</span>
                <span className="tag">知识网络</span>
              </div>
            </div>

            {/* 特色2 */}
            <div className="card">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xf-surface to-xf-primary/30 flex items-center justify-center mb-6">
                <Sword className="w-7 h-7 text-xf-primary lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">跨界挑战</h3>
              <p className="text-xf-medium mb-6">打破学科边界，通过精心设计的挑战任务，激发你的创新思维与问题解决能力。</p>
              <div className="flex flex-wrap gap-2">
                <span className="tag">跨学科</span>
                <span className="tag">思维训练</span>
              </div>
            </div>

            {/* 特色3 */}
            <div className="card">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xf-bg to-xf-accent/30 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-xf-accent lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">深度社群</h3>
              <p className="text-xf-medium mb-6">与志同道合的思考者建立连接，参与深度对谈，分享洞见，共同成长。</p>
              <div className="flex flex-wrap gap-2">
                <span className="tag">高质量交流</span>
                <span className="tag">互助成长</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 如何运作 */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">简单三步，开启旅程</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">加入相逢，开始你的深度思考与改变之旅</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 连接线 */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-xf-soft via-xf-primary/30 to-xf-soft transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                {/* 步骤1 */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-xf-soft to-xf-info/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-xf-info">1</div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">注册与探索</h3>
                  <p className="text-xf-medium">创建属于你的思考者档案，探索不同领域的深度内容与社群。</p>
                </div>

                {/* 步骤2 */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-xf-surface to-xf-primary/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-xf-primary">2</div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">连接与碰撞</h3>
                  <p className="text-xf-medium">参与讨论，关注深度思考者，建立有价值的连接，激发思维火花。</p>
                </div>

                {/* 步骤3 */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-xf-bg to-xf-accent/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-xf-accent">3</div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">成长与改变</h3>
                  <p className="text-xf-medium">通过跨界挑战与深度反思，实现认知升级与个人成长。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 社群展示 */}
      <section id="community" className="py-20 gradient-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">加入深度思考者社群</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">与数千名深度思考者一起探索认知边界</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* 左侧：用户评价 */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-xf-dark mb-8">思考者们说</h3>
                    
                    <div className="space-y-6">
                      {/* 评价1 */}
                      <div className="bg-white rounded-2xl p-6 shadow-soft">
                        <div className="flex items-center gap-4 mb-4">
                          <img src="https://api.dicebear.com/7.x/micah/svg?seed=Sophie&backgroundColor=B6CAD7" className="w-12 h-12 rounded-full" />
                          <div>
                            <h4 className="font-bold text-xf-dark">Sophie</h4>
                            <p className="text-sm text-xf-medium">哲学研究者</p>
                          </div>
                        </div>
                        <p className="text-xf-dark/80 italic">"在相逢找到了久违的思想碰撞，这里的讨论质量远超其他平台。"</p>
                      </div>
                      
                      {/* 评价2 */}
                      <div className="bg-white rounded-2xl p-6 shadow-soft">
                        <div className="flex items-center gap-4 mb-4">
                          <img src="https://api.dicebear.com/7.x/micah/svg?seed=Alex&backgroundColor=D2C3D5" className="w-12 h-12 rounded-full" />
                          <div>
                            <h4 className="font-bold text-xf-dark">Alex</h4>
                            <p className="text-sm text-xf-medium">产品设计师</p>
                          </div>
                        </div>
                        <p className="text-xf-dark/80 italic">"跨界挑战让我突破了专业壁垒，开始用全新视角看待设计问题。"</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 右侧：数据统计 */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-xf-dark mb-8">我们的社群</h3>
                    
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="bg-white rounded-2xl p-6 text-center shadow-soft">
                        <div className="text-3xl font-bold text-xf-accent mb-2">5,000+</div>
                        <p className="text-xf-medium">深度思考者</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 text-center shadow-soft">
                        <div className="text-3xl font-bold text-xf-primary mb-2">10,000+</div>
                        <p className="text-xf-medium">深度对话</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 text-center shadow-soft">
                        <div className="text-3xl font-bold text-xf-info mb-2">500+</div>
                        <p className="text-xf-medium">跨界挑战</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 text-center shadow-soft">
                        <div className="text-3xl font-bold text-xf-success mb-2">92%</div>
                        <p className="text-xf-medium">用户满意度</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-xf-accent/10 to-xf-primary/10 rounded-2xl p-6">
                      <h4 className="font-bold text-xf-dark mb-3">每周深度活动</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-xf-info lucide-icon" />
                          <span className="text-xf-dark">周二：哲学夜谈</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-xf-primary lucide-icon" />
                          <span className="text-xf-dark">周四：跨界工作坊</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-xf-accent lucide-icon" />
                          <span className="text-xf-dark">周六：深度阅读会</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 定价 */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">选择适合你的计划</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">开始免费体验，随时升级以获得完整功能</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 免费计划 */}
              <div className="card bg-white rounded-3xl p-8 border-2 border-xf-bg/50 hover:border-xf-primary/30 shadow-soft hover:shadow-elevated">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif font-bold text-xf-dark mb-2">探索者</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-xf-dark">免费</span>
                    <span className="text-xf-medium ml-2">/ 永久</span>
                  </div>
                  <p className="text-xf-medium mt-2">适合初次接触深度思考的你</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-xf-success lucide-icon" />
                    <span>每日阅读5篇深度内容</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-xf-success lucide-icon" />
                    <span>参与社群讨论</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-xf-success lucide-icon" />
                    <span>基础跨界挑战</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="w-5 h-5 text-xf-medium/50 lucide-icon" />
                    <span className="text-xf-medium/70">深度分析工具</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="w-5 h-5 text-xf-medium/50 lucide-icon" />
                    <span className="text-xf-medium/70">个性化认知地图</span>
                  </li>
                </ul>
                
                <a href="/login" className="w-full py-3 bg-xf-light hover:bg-xf-bg text-xf-primary rounded-xl font-medium transition-all block text-center">
                  开始免费体验
                </a>
              </div>
              
              {/* 高级计划 */}
              <div className="card bg-gradient-to-br from-xf-accent to-xf-primary rounded-3xl p-8 shadow-soft hover:shadow-elevated relative overflow-hidden">
                {/* 热门标签 */}
                <div className="absolute top-6 right-6 bg-white text-xf-accent px-3 py-1 rounded-full text-xs font-bold">
                  最受欢迎
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">深度思考者</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">¥29</span>
                    <span className="text-white/80 ml-2">/ 月</span>
                  </div>
                  <p className="text-white/80 mt-2">适合追求深度与改变的思考者</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white lucide-icon" />
                    <span className="text-white">无限深度内容阅读</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white lucide-icon" />
                    <span className="text-white">高级跨界挑战</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white lucide-icon" />
                    <span className="text-white">个性化认知地图</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white lucide-icon" />
                    <span className="text-white">深度分析工具</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white lucide-icon" />
                    <span className="text-white">优先活动参与权</span>
                  </li>
                </ul>
                
                <a href="/login" className="w-full py-3 bg-white hover:bg-xf-light text-xf-accent rounded-xl font-semibold transition-all shadow-md hover:shadow-lg block text-center">
                  升级为深度思考者
                </a>
              </div>
            </div>
            
            <p className="text-center text-xf-medium mt-8">所有计划均包含7天深度思考者试用期</p>
          </div>
        </div>
      </section>

      {/* 最终行动号召 */}
      <section className="py-20 bg-gradient-to-br from-xf-accent/5 to-xf-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">准备好开始改变了吗？</h2>
              <p className="text-lg text-xf-medium mb-8 max-w-2xl mx-auto">加入相逢，与深度思考者一起探索未知，突破认知边界</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/login" className="btn-primary px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-98">
                  开启深度之旅
                </a>
                <a href="#" className="btn-secondary px-8 py-4 text-lg rounded-2xl">
                  了解更多
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-xf-dark text-white pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Logo和描述 */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="logo-icon w-10 h-10 bg-gradient-to-tr from-xf-accent to-xf-primary rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white lucide-icon">
                    <circle cx="18" cy="18" r="3"/>
                    <circle cx="6" cy="6" r="3"/>
                    <path d="M6 21V9a9 9 0 0 0 9 9"/>
                  </svg>
                </div>
                <span className="font-serif text-2xl font-bold text-white">相逢</span>
              </div>
              <p className="text-white/70 max-w-md mb-6">相逢是一个深度思考者社群，致力于连接不同领域的思考者，促进跨界交流与认知升级。</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                  <Twitter className="w-5 h-5 lucide-icon" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                  <Github className="w-5 h-5 lucide-icon" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                  <Instagram className="w-5 h-5 lucide-icon" />
                </a>
              </div>
            </div>
            
            {/* 产品 */}
            <div>
              <h4 className="font-bold text-lg mb-6">产品</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-white/70 hover:text-white transition">特色功能</a></li>
                <li><a href="#how-it-works" className="text-white/70 hover:text-white transition">如何运作</a></li>
                <li><a href="#pricing" className="text-white/70 hover:text-white transition">定价</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition">更新日志</a></li>
              </ul>
            </div>
            
            {/* 公司 */}
            <div>
              <h4 className="font-bold text-lg mb-6">公司</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-white/70 hover:text-white transition">关于我们</a></li>
                <li><a href="/blog" className="text-white/70 hover:text-white transition">博客</a></li>
                <li><a href="/careers" className="text-white/70 hover:text-white transition">加入我们</a></li>
                <li><a href="/contact" className="text-white/70 hover:text-white transition">联系我们</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/70">&copy; 2026 相逢. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}