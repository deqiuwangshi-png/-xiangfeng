/**
 * Hero区域组件 - 首屏关键内容 (Server Component)
 * @module components/marketing/HeroSection
 * @description 响应式Hero区域，移动端优化显示
 * @优化说明 改为Server Component，将动画部分分离到客户端组件
 */
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Bookmark, Sparkles, Brain } from 'lucide-react'
import { RevealOnScrollClient } from './RevealOnScrollClient'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12 pb-12 sm:pb-20">
      {/* 背景装饰 - 使用CSS动画，无需JavaScript */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 sm:w-64 h-32 sm:h-64 bg-xf-info/20 rounded-full blur-2xl sm:blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[5%] w-40 sm:w-80 h-40 sm:h-80 bg-xf-primary/15 rounded-full blur-[50px] sm:blur-[100px] animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1200px] h-[500px] sm:h-[1000px] grid-bg opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/*
           * LCP关键内容区域：服务端直接渲染
           * 确保标题、副标题、按钮立即可见，无需等待JS加载
           */}
          <div className="hero-content">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full mb-4 sm:mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-xf-info opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-xf-info"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-xf-accent tracking-wide uppercase">面向全球80亿人，致敬全球思考者</span>
            </div>

            {/* 主标题 - LCP关键元素 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight text-xf-dark lcp-text">
              <span className="text-xf-accent">不止相遇</span>
              <span className="block mt-1 sm:mt-2">更是<span className="text-xf-info relative inline-block">改变<svg className="absolute w-full h-2 sm:h-3 -bottom-0.5 sm:-bottom-1 left-0 text-xf-info/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" /></svg></span></span>
            </h1>

            {/* 副标题 - LCP关键元素 */}
            <p className="text-sm sm:text-lg text-xf-medium mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 lcp-text">
              把碎片化笔记、知识、领域甚至经验，整理成属于你的完整逻辑体系，享受平台带来的长期红利，为深度阅读而生，为思考者而来。
            </p>

            {/* CTA按钮 - LCP关键元素 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4 sm:px-0">
              <Link href="/login">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-xf-dark hover:bg-xf-accent text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 touch-manipulation">
                  开启深度思考之旅 <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/*
           * UI预览区域：非关键内容，使用客户端组件延迟加载
           * 不影响LCP，因为这不是 Largest Contentful Paint 的候选元素
           */}
          <RevealOnScrollClient delay={100}>
            <div className="relative max-w-5xl mx-auto mt-8 sm:mt-12 px-2 sm:px-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-white/50 bg-white/40 backdrop-blur-sm p-1.5 sm:p-2">
                <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner">
                  <div className="p-3 sm:p-6">
                    {/* 头部区域 */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-xf-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                          <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-xf-dark">今日精选 · 深度长文</h3>
                          <p className="text-[10px] sm:text-xs text-xf-medium">读者共同推荐</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                          <Users className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                        </div>
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <Bookmark className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* 文章卡片网格 */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      {/* 文章卡片1 */}
                      <div className="h-28 sm:h-44 bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default hover:border-xf-primary/30 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                            <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-xf-info" />
                            <span className="text-[10px] sm:text-xs text-xf-medium">哲学思考</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-xf-dark mb-1.5 sm:mb-2 line-clamp-2 leading-tight">技术的本质与人的边界</h4>
                          <p className="text-[9px] sm:text-xs text-xf-medium line-clamp-2 leading-relaxed">万字长文探讨数字时代下人的主体性重构……</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-xs text-xf-medium">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            林溪
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            142
                          </span>
                        </div>
                      </div>

                      {/* 文章卡片2 */}
                      <div className="h-28 sm:h-44 bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default hover:border-xf-primary/30 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                            <Bookmark className="w-3 sm:w-4 h-3 sm:h-4 text-xf-accent" />
                            <span className="text-[10px] sm:text-xs text-xf-medium">城市纪实</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-xf-dark mb-1.5 sm:mb-2 line-clamp-2 leading-tight">消失的胡同：口述历史与空间记忆</h4>
                          <p className="text-[9px] sm:text-xs text-xf-medium line-clamp-2 leading-relaxed">走访三十位老街坊，书写一座城市的背面……</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-xs text-xf-medium">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            北岛
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            89
                          </span>
                        </div>
                      </div>

                      {/* 文章卡片3 */}
                      <div className="h-28 sm:h-44 bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default hover:border-xf-primary/30 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-xf-primary" />
                            <span className="text-[10px] sm:text-xs text-xf-medium">科技人文</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-xf-dark mb-1.5 sm:mb-2 line-clamp-2 leading-tight">AI时代，为何更需要慢阅读？</h4>
                          <p className="text-[9px] sm:text-xs text-xf-medium line-clamp-2 leading-relaxed">重新定义注意力，在长文中寻回思考的深度……</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-xs text-xf-medium">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            知更
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            210
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 底部标签 */}
                    <div className="mt-3 sm:mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[10px] sm:text-xs text-xf-medium">🔥 热门标签：</span>
                        <span className="text-[10px] sm:text-xs text-xf-primary">#长文推荐</span>
                        <span className="text-[10px] sm:text-xs text-xf-primary">#人文社科</span>
                        <span className="text-[10px] sm:text-xs text-xf-primary">#创作者访谈</span>
                      </div>
                      <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-16 sm:w-24 h-16 sm:h-24 bg-linear-to-br from-xf-soft to-xf-primary/30 rounded-full blur-lg sm:blur-xl opacity-60 animate-blob"></div>
              <div className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 w-20 sm:w-32 h-20 sm:h-32 bg-linear-to-tr from-xf-surface to-xf-accent/20 rounded-full blur-lg sm:blur-xl opacity-60 animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>
          </RevealOnScrollClient>
        </div>
      </div>
    </section>
  )
}
