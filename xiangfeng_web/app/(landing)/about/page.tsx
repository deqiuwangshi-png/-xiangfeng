'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Target, Brain, Users, RefreshCw, Shield, Mail, Github, Twitter, Instagram, Menu, X } from 'lucide-react';
import { Logo } from '@/src/components/brand/Logo';

// 类型守卫
const isHTMLElement = (element: Element | null | undefined): element is HTMLElement => {
  return element !== null && element !== undefined && 'offsetTop' in element;
};

// 导航链接类型
interface NavLink {
  href: string;
  label: string;
}

export default function AboutPage() {
  // 状态管理
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  
  // DOM引用
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  
  // 导航链接数据
  const navLinks: NavLink[] = [
    { href: '/', label: '首页' },
    { href: '/#features', label: '特色功能' },
    { href: '#vision', label: '我们的愿景' },
    { href: '#timeline', label: '发展历程' },
    { href: '#developer', label: '开发者' }
  ];
  
  // 移动端菜单切换函数
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  // 关闭移动端菜单
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);
  
  // 更新激活的导航链接
  const updateActiveNav = useCallback(() => {
    const scrollPosition = window.scrollY + 100;
    
    sectionsRef.current.forEach(section => {
      if (isHTMLElement(section)) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      }
    });
  }, []);
  
  // 初始化滚动事件监听
  useEffect(() => {
    // 添加滚动事件监听
    window.addEventListener('scroll', updateActiveNav);
    
    // 初始更新一次导航激活状态
    updateActiveNav();
    
    // 点击外部关闭移动端菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && mobileMenuBtnRef.current &&
          !mobileMenuRef.current.contains(event.target as Node) &&
          !mobileMenuBtnRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    // 添加点击外部事件监听
    document.addEventListener('mousedown', handleClickOutside);
    
    // 初始收集所有section元素
    const sections = document.querySelectorAll('section[id]');
    sectionsRef.current = Array.from(sections).map(section => isHTMLElement(section) ? section : null);
    
    return () => {
      // 清理所有事件监听器
      window.removeEventListener('scroll', updateActiveNav);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [updateActiveNav]);
  
  return (
    <div id="about-view" className="min-h-screen flex flex-col bg-xf-light text-xf-dark antialiased font-sans selection-soft overflow-x-hidden">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-xf-bg/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Logo size="md" showText={true} />

          {/* 桌面导航菜单 */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-active-indicator text-xf-primary hover:text-xf-accent font-medium transition-colors ${link.href === `#${activeSection}` ? 'active' : ''}`}
                aria-current={link.href === `#${activeSection}` ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* 行动按钮 */}
          <div className="flex items-center gap-4">
            <a href="/login" className="px-6 py-2.5 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98">
              登录
            </a>
            {/* 移动端菜单按钮 */}
            <button
              id="mobile-menu-btn"
              ref={mobileMenuBtnRef}
              className="md:hidden text-xf-primary"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={mobileMenuOpen}
              aria-haspopup="true"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 lucide-icon" /> : <Menu className="w-6 h-6 lucide-icon" />}
            </button>
          </div>

          {/* 移动端菜单 - 使用条件渲染 */}
          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              ref={mobileMenuRef}
              className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-xf-bg/30"
              role="menu"
              aria-labelledby="mobile-menu-btn"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`text-xf-primary hover:text-xf-accent font-medium py-2 ${link.href === `#${activeSection}` ? 'font-bold' : ''}`}
                    onClick={closeMobileMenu}
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-xf-bg/30">
                  <a
                    href="/login"
                    className="w-full py-3 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-xl font-medium transition-all shadow-md"
                    onClick={closeMobileMenu}
                  >
                    立即体验
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 页面标题区域 */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        {/* 背景装饰 */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-xf-soft/30 to-xf-primary/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-xf-surface/20 to-xf-accent/10 rounded-full blur-3xl animate-float"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-xf-light/80 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-xf-info animate-pulse"></div>
              <span className="text-sm font-medium text-xf-primary">深度了解相逢</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 animate-fade-in" style={{animationDelay: "0.1s"}}>
              <span className="text-xf-accent">不止相遇</span>
              <span className="block mt-2">更是<span className="text-xf-primary">改变</span>的开始</span>
            </h1>

            {/* 副标题 */}
            <p className="text-lg md:text-xl text-xf-medium mb-10 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
              深入了解相逢的使命、愿景和价值观，探索我们如何帮助深度思考者打破认知边界，建立真正的思维连接。
            </p>
          </div>
        </div>
      </section>

      {/* 愿景与使命 */}
      <section id="vision" className="py-20 bg-gradient-to-b from-white to-xf-light/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">我们的愿景与使命</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">我们相信深度思考的力量，致力于构建一个让思考者真正相遇的平台</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 愿景 */}
            <div className="card bg-white rounded-3xl p-8 shadow-soft hover:shadow-elevated">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-xf-soft to-xf-info/30 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-xf-info lucide-icon" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-xf-dark mb-4">我们的愿景</h3>
              <p className="text-xf-medium mb-6">
                创造一个世界，在那里每个深度思考者都能找到共鸣，每个独特思想都能得到尊重和回应，每个认知边界都能被勇敢跨越。
              </p>
              <p className="text-xf-dark/80">
                我们相信，当思想自由碰撞，当认知边界被打破，人类社会将迎来真正的创新与进步。相逢致力于成为这个变革的催化剂。
              </p>
            </div>

            {/* 使命 */}
            <div className="card bg-white rounded-3xl p-8 shadow-soft hover:shadow-elevated">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-xf-surface to-xf-primary/30 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-xf-primary lucide-icon" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-xf-dark mb-4">我们的使命</h3>
              <p className="text-xf-medium mb-6">
                构建深度思考者的精神家园，通过技术赋能思想连接，促进跨界交流，推动认知升级，让每一次相遇都成为改变的开始。
              </p>
              <p className="text-xf-dark/80">
                我们不只是搭建一个平台，更是营造一个生态系统，让思考者在这里成长、碰撞、改变，最终影响更广阔的世界。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 核心价值观 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">核心价值观</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">指导我们前行的基本原则</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* 价值1 */}
            <div className="value-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-xf-soft to-xf-info/30 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 text-xf-info lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">深度思考</h3>
              <p className="text-xf-medium text-sm">我们珍视深度思考的力量，相信真正的改变源于深刻的洞察与反思。</p>
            </div>

            {/* 价值2 */}
            <div className="value-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-xf-surface to-xf-primary/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-xf-primary lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">真诚连接</h3>
              <p className="text-xf-medium text-sm">我们相信真诚的连接能打破认知孤岛，创造有意义的对话与合作。</p>
            </div>

            {/* 价值3 */}
            <div className="value-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-xf-bg to-xf-accent/30 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-7 h-7 text-xf-accent lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">持续进化</h3>
              <p className="text-xf-medium text-sm">我们鼓励持续学习与认知升级，相信个人与社群的共同成长。</p>
            </div>

            {/* 价值4 */}
            <div className="value-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-xf-info/20 to-xf-success/30 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-xf-success lucide-icon" />
              </div>
              <h3 className="text-xl font-serif font-bold text-xf-dark mb-3">安全包容</h3>
              <p className="text-xf-medium text-sm">我们营造安全、包容的环境，尊重多元观点，保护用户隐私。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section id="timeline" className="py-20 gradient-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">发展历程</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">相逢从概念到现实的成长之路</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-10">
              {/* 历程1 */}
              <div className="timeline-item">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-xf-dark">灵感诞生</h3>
                    <span className="text-xf-primary font-medium bg-xf-light px-3 py-1 rounded-full text-sm mt-2 md:mt-0">2022年 · 春季</span>
                  </div>
                  <p className="text-xf-medium">
                    作为一名深度思考者，我观察到主流社交媒体中深度内容的缺失，决定创建一个专注于深度思考者连接的平台。经过数月的思考和研究，相逢的概念逐渐成型。
                  </p>
                </div>
              </div>

              {/* 历程2 */}
              <div className="timeline-item">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-xf-dark">独立开发</h3>
                    <span className="text-xf-primary font-medium bg-xf-light px-3 py-1 rounded-full text-sm mt-2 md:mt-0">2022年 · 秋季</span>
                  </div>
                  <p className="text-xf-medium">
                    开始独立开发相逢平台，专注于"认知星云"和"跨界挑战"两大核心功能的设计与实现。从UI/UX设计到前后端开发，每一步都亲力亲为。
                  </p>
                </div>
              </div>

              {/* 历程3 */}
              <div className="timeline-item">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-xf-dark">早期测试</h3>
                    <span className="text-xf-primary font-medium bg-xf-light px-3 py-1 rounded-full text-sm mt-2 md:mt-0">2023年 · 春季</span>
                  </div>
                  <p className="text-xf-medium">
                    邀请50位深度思考者参与早期测试，收集了大量宝贵反馈。根据用户建议，迭代优化了界面设计和社群功能，用户满意度达到92%。
                  </p>
                </div>
              </div>

              {/* 历程4 */}
              <div className="timeline-item">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-xf-dark">正式上线</h3>
                    <span className="text-xf-primary font-medium bg-xf-light px-3 py-1 rounded-full text-sm mt-2 md:mt-0">2023年 · 秋季</span>
                  </div>
                  <p className="text-xf-medium">
                    相逢1.0版本正式上线，推出了免费和付费两种计划。首月即吸引了超过500名深度思考者加入，社群活跃度超出预期。
                  </p>
                </div>
              </div>

              {/* 历程5 */}
              <div className="timeline-item">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-xf-dark">持续迭代</h3>
                    <span className="text-xf-primary font-medium bg-xf-light px-3 py-1 rounded-full text-sm mt-2 md:mt-0">2024年 · 至今</span>
                  </div>
                  <p className="text-xf-medium">
                    用户数量持续增长，社群深度对话日益丰富。基于用户反馈不断优化产品体验，推出"深度阅读会"和"哲学夜谈"等品牌活动。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 开发者介绍 */}
      <section id="developer" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">独立开发者</h2>
            <p className="text-lg text-xf-medium max-w-2xl mx-auto">一个相信思想力量的梦想家与实践者</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="developer-card bg-white rounded-3xl p-8 shadow-soft overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* 开发者头像 */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img src="https://api.dicebear.com/7.x/micah/svg?seed=Xiangfeng&backgroundColor=B6CAD7&radius=50" className="w-48 h-48 rounded-2xl shadow-lg" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 blob bg-gradient-to-br from-xf-soft/40 to-xf-primary/20"></div>
                  </div>
                </div>
                
                {/* 开发者信息 */}
                <div className="flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-xf-dark mb-2">相逢 · 独立开发者</h3>
                  <p className="text-xf-primary text-lg font-medium mb-4">全栈开发者 · 深度思考者</p>
                  
                  <div className="mb-6">
                    <p className="text-xf-medium mb-4">
                      你好！我是相逢的创造者。作为一名深度思考者和全栈开发者，我热爱探索思想与技术的交汇点。
                    </p>
                    <p className="text-xf-medium mb-4">
                      我坚信深度思考能改变世界，而技术应该服务于人类的精神成长。相逢不仅是一个产品，更是我多年思考与实践的结晶。
                    </p>
                    <p className="text-xf-medium">
                      从概念设计到代码实现，从用户体验到社群运营，相逢的每一个细节都凝聚着我的热情与专注。我希望通过这个平台，连接更多志同道合的思考者，共同探索认知的边界。
                    </p>
                  </div>
                  
                  {/* 技能标签 */}
                  <div className="mb-6">
                    <h4 className="font-bold text-xf-dark mb-3">技术栈与专长</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="tag px-3 py-1 text-sm font-medium rounded-full">全栈开发</span>
                      <span className="tag px-3 py-1 text-sm font-medium rounded-full">UI/UX设计</span>
                      <span className="tag px-3 py-1 text-sm font-medium rounded-full">产品思维</span>
                      <span className="tag px-3 py-1 text-sm font-medium rounded-full">哲学思考</span>
                      <span className="tag px-3 py-1 text-sm font-medium rounded-full">社群构建</span>
                    </div>
                  </div>
                  
                  {/* 联系信息 */}
                  <div>
                    <h4 className="font-bold text-xf-dark mb-3">联系与反馈</h4>
                    <p className="text-xf-medium mb-4">
                      作为独立开发者，我珍视每一位用户的反馈。你的建议将直接影响相逢的发展方向。
                    </p>
                    <div className="flex gap-4">
                      <a href="mailto:contact@xiangfeng.app" className="inline-flex items-center gap-2 text-xf-info hover:text-xf-accent transition font-medium">
                        <Mail className="w-4 h-4 lucide-icon" />
                        <span>contact@xiangfeng.app</span>
                      </a>
                      <a href="#" className="inline-flex items-center gap-2 text-xf-info hover:text-xf-accent transition font-medium">
                        <Github className="w-4 h-4 lucide-icon" />
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-xf-medium max-w-2xl mx-auto">
                相逢是一个持续进化的项目，我将根据用户反馈和市场需求不断优化和扩展功能。期待与你一起构建这个深度思考者的精神家园。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 加入我们 */}
      <section className="py-20 bg-gradient-to-br from-xf-accent/5 to-xf-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-xf-accent mb-4">加入深度思考者社群</h2>
              <p className="text-lg text-xf-medium mb-8 max-w-2xl mx-auto">
                无论你是寻找思想共鸣的探索者，还是希望分享洞见的思考者，相逢都欢迎你的加入。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/login" className="px-8 py-4 bg-gradient-to-r from-xf-accent to-xf-primary hover:from-xf-accent/90 hover:to-xf-primary/90 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  立即加入
                </a>
                <a href="/" className="px-8 py-4 bg-white hover:bg-xf-light border border-xf-bg/60 hover:border-xf-primary/30 text-xf-primary rounded-2xl font-semibold text-lg transition-all shadow-md hover:shadow-lg">
                  返回首页
                </a>
              </div>
              
              <p className="text-sm text-xf-medium mt-8">
                想了解更多？查看我们的
                <a href="/#features" className="text-xf-info hover:text-xf-accent font-medium ml-1">特色功能</a>
                或
                <a href="/#pricing" className="text-xf-info hover:text-xf-accent font-medium ml-1">定价计划</a>
              </p>
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
                <Logo size="md" showText={true} className="text-white" />
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
                <li><a href="/#features" className="text-white/70 hover:text-white transition">特色功能</a></li>
                <li><a href="/#how-it-works" className="text-white/70 hover:text-white transition">如何运作</a></li>
                <li><a href="/#pricing" className="text-white/70 hover:text-white transition">定价</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition">更新日志</a></li>
              </ul>
            </div>
            
            {/* 公司 */}
            <div>
              <h4 className="font-bold text-lg mb-6">公司</h4>
              <ul className="space-y-3">
                <li><a href="#vision" className="text-white/70 hover:text-white transition">关于我们</a></li>
                <li><a href="/#community" className="text-white/70 hover:text-white transition">社群</a></li>
                <li><a href="#developer" className="text-white/70 hover:text-white transition">开发者</a></li>
                <li><a href="/contact" className="text-white/70 hover:text-white transition">联系我们</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">© 2024 相逢 Xiangfeng. 保留所有权利。</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-white/50 hover:text-white text-sm transition">隐私政策</a>
                <a href="/terms" className="text-white/50 hover:text-white text-sm transition">服务条款</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}