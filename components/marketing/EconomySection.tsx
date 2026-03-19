/**
 * 生态经济区组件
 * @module components/marketing/EconomySection
 * @description 响应式生态经济展示，移动端优化
 * @性能优化 P1: 将 router.push 改为 Link 组件，启用自动预加载
 */

'use client'

import Link from 'next/link'
import { DollarSign, RefreshCw, Clock, Check } from 'lucide-react'
import { RevealOnScroll } from './RevealOnScroll'

/**
 * 经济特性数据
 * @constant economyFeatures
 */
const economyFeatures = [
  {
    icon: DollarSign,
    title: '价值创造',
    description: '深度思考与知识分享创造真实价值，而非依赖广告或流量变现。',
    color: 'info',
  },
  {
    icon: RefreshCw,
    title: '生态循环',
    description: '价值在创作者、读者和平台间循环流动，形成可持续的良性生态。',
    color: 'primary',
  },
  {
    icon: Clock,
    title: '长期主义',
    description: '鼓励深度思考与持续创造，而非短期流量与热点追逐。',
    color: 'accent',
  },
]

/**
 * 创作者权益数据
 * @constant creatorBenefits
 */
const creatorBenefits = [
  { label: '内容价值指数', value: '深度推荐' },
  { label: '生态贡献认证', value: '专属徽章' },
  { label: '协作项目分成', value: '解决现实' },
]

/**
 * 读者权益数据
 * @constant readerBenefits
 */
const readerBenefits = [
  '免费阅读基础内容',
  '订阅深度专栏',
  '参与价值评估与投票',
]

/**
 * 生态经济区组件
 * @returns {JSX.Element} 生态经济区
 */
export default function EconomySection() {
  return (
    <section id="economy" className="py-12 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-16 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-xf-dark mb-3 sm:mb-4">价值驱动的生态经济</h2>
            <p className="text-sm sm:text-lg text-xf-medium">拒绝流量算法，回归价值本质</p>
          </div>
        </RevealOnScroll>

        <div className="max-w-6xl mx-auto">
          {/* 特性卡片 - 移动端单列，桌面端三列 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {economyFeatures.map((feature, index) => (
              <RevealOnScroll key={feature.title} delay={(index + 1) * 100}>
                <div className="bg-xf-light/50 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-slate-100 touch-manipulation">
                  <feature.icon className={`w-6 sm:w-8 h-6 sm:h-8 text-xf-${feature.color} mb-3 sm:mb-4`} />
                  <h3 className="text-lg sm:text-xl font-bold text-xf-dark mb-2">{feature.title}</h3>
                  <p className="text-xf-medium text-xs sm:text-sm">{feature.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* 权益对比卡片 */}
          <RevealOnScroll delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {/* 创作者卡片 */}
              <div className="flex flex-col bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-xf-bg shadow-sm">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-xf-dark">创作者</h3>
                  <span className="bg-xf-primary/10 text-xf-primary text-xs font-bold px-3 py-1 rounded-full">Pro</span>
                </div>
                <ul className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                  {creatorBenefits.map((benefit) => (
                    <li key={benefit.label} className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-xf-medium text-sm">{benefit.label}</span>
                      <span className="font-bold text-xf-dark text-sm">{benefit.value}</span>
                    </li>
                  ))}
                </ul>
                {/* @性能优化: 使用 Link 替代 router.push，启用自动预加载 */}
                <Link
                  href="/login"
                  className="block w-full py-3 bg-xf-light hover:bg-slate-200 text-xf-dark rounded-xl font-medium transition-colors mt-auto touch-manipulation active-scale text-center"
                >
                  申请成为创作者
                </Link>
              </div>

              {/* 读者卡片 */}
              <div className="flex flex-col bg-xf-primary rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold">读者参与</h3>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Open</span>
                </div>
                <ul className="space-y-4 sm:space-y-5 mb-6 sm:mb-8 relative z-10">
                  {readerBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="opacity-90 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                {/* @性能优化: 使用 Link 替代 router.push，启用自动预加载 */}
                <Link
                  href="/login"
                  className="block w-full py-3 bg-white text-xf-primary hover:bg-slate-50 rounded-xl font-bold transition-colors shadow-md mt-auto text-center"
                >
                  立即免费加入
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
