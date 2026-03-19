'use client'

/**
 * Hero区域组件 - 首屏关键内容
 * @module components/marketing/HeroSection
 * @description 响应式Hero区域，移动端优化显示
 *
 * LCP优化策略：
 * - 首屏关键内容（标题、副标题、CTA按钮）不使用RevealOnScroll
 *   确保这些元素在HTML解析后立即可见，不依赖JS执行
 * - 仅对装饰性内容和下方UI预览使用reveal动画
 * - 使用hero-content类确保内容立即渲染
 */

import { ArrowRight, BrainCircuit, Sparkles, Users, GitMerge } from 'lucide-react'
import { RevealOnScroll } from './RevealOnScroll'

/**
 * Hero区域组件
 * @returns {JSX.Element} Hero区域
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12 pb-12 sm:pb-20">
      {/* 背景装饰 - 不影响LCP */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 sm:w-64 h-32 sm:h-64 bg-xf-info/20 rounded-full blur-2xl sm:blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[5%] w-40 sm:w-80 h-40 sm:h-80 bg-xf-primary/15 rounded-full blur-[50px] sm:blur-[100px] animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1200px] h-[500px] sm:h-[1000px] grid-bg opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/*
           * LCP关键内容区域：不使用RevealOnScroll包装
           * 确保标题、副标题、按钮立即可见
           */}
          <div className="hero-content">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full mb-4 sm:mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-xf-info opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-xf-info"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-xf-accent tracking-wide uppercase">深度思考者的精神家园</span>
            </div>

            {/* 主标题 - LCP关键元素 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight text-xf-dark lcp-text">
              <span className="text-xf-accent">不止相遇</span>
              <span className="block mt-1 sm:mt-2">更是<span className="text-xf-info relative inline-block">改变<svg className="absolute w-full h-2 sm:h-3 -bottom-0.5 sm:-bottom-1 left-0 text-xf-info/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none"/></svg></span></span>
            </h1>

            {/* 副标题 - LCP关键元素 */}
            <p className="text-sm sm:text-lg text-xf-medium mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 lcp-text">
              在嘈杂的信息流中寻找深度连接。打破认知边界，构建属于你的思维网络，与志同道合者共创价值。
            </p>

            {/* CTA按钮 - LCP关键元素 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4 sm:px-0">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-xf-dark hover:bg-xf-accent text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
              >
                开启深度之旅 <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/80 hover:bg-white border border-xf-bg text-xf-dark rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all shadow-sm hover:shadow-md backdrop-blur-sm touch-manipulation"
              >
                探索特色
              </button>
            </div>
          </div>

          {/*
           * UI预览区域：非关键内容，使用reveal动画
           * 不影响LCP，因为这不是 Largest Contentful Paint 的候选元素
           */}
          <RevealOnScroll delay={100}>
            <div className="relative max-w-5xl mx-auto mt-8 sm:mt-12 px-2 sm:px-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-white/50 bg-white/40 backdrop-blur-sm p-1.5 sm:p-2">
                <div className="bg-xf-light rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner">
                  <div className="p-3 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-8 opacity-80">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-xf-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                          <GitMerge className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div className="space-y-1 sm:space-y-1.5">
                          <div className="h-2 sm:h-2.5 w-16 sm:w-24 bg-slate-300 rounded-full"></div>
                          <div className="h-1.5 sm:h-2 w-10 sm:w-16 bg-slate-200 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white border border-slate-200"></div>
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-slate-200 border border-slate-200"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-5">
                      <div className="h-24 sm:h-40 bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md sm:rounded-lg bg-xf-soft/20 text-xf-info flex items-center justify-center mb-1 sm:mb-2">
                          <BrainCircuit className="w-3 sm:w-4 h-3 sm:h-4" />
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="h-2 sm:h-3 w-3/4 bg-slate-200 rounded-full group-hover:bg-xf-soft/50 transition-colors"></div>
                          <div className="h-1.5 sm:h-2 w-full bg-slate-100 rounded-full"></div>
                          <div className="hidden sm:block h-2 w-2/3 bg-slate-100 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-24 sm:h-40 bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-md border border-xf-primary/10 flex flex-col justify-between">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md sm:rounded-lg bg-xf-primary/20 text-xf-primary flex items-center justify-center mb-1 sm:mb-2">
                          <Sparkles className="w-3 sm:w-4 h-3 sm:h-4" />
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="h-2 sm:h-3 w-4/5 bg-xf-primary/20 rounded-full"></div>
                          <div className="h-1.5 sm:h-2 w-full bg-xf-primary/10 rounded-full"></div>
                          <div className="hidden sm:block h-2 w-5/6 bg-xf-primary/10 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-24 sm:h-40 bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md sm:rounded-lg bg-xf-accent/10 text-xf-accent flex items-center justify-center mb-1 sm:mb-2">
                          <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <div className="h-2 sm:h-3 w-2/3 bg-slate-200 rounded-full group-hover:bg-xf-accent/20 transition-colors"></div>
                          <div className="h-1.5 sm:h-2 w-full bg-slate-100 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-6 h-12 sm:h-24 w-full bg-white/60 rounded-lg sm:rounded-xl border border-slate-100"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-16 sm:w-24 h-16 sm:h-24 bg-linear-to-br from-xf-soft to-xf-primary/30 rounded-full blur-lg sm:blur-xl opacity-60 animate-blob"></div>
              <div className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 w-20 sm:w-32 h-20 sm:h-32 bg-linear-to-tr from-xf-surface to-xf-accent/20 rounded-full blur-lg sm:blur-xl opacity-60 animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
