'use client'

/**
 * 特色功能区组件
 * @module components/marketing/FeaturesSection
 * @description 响应式特色功能展示，移动端单列布局
 */

import { Network, Swords, Sprout } from 'lucide-react'
import { RevealOnScroll } from './RevealOnScroll'

/**
 * 功能特性数据
 * @constant features
 */
const features = [
  {
    icon: Network,
    title: '认知星云',
    description: '可视化你的思维网络，连接不同领域的知识点，构建属于你的认知星系。',
    tag: '思维可视化',
    color: 'info',
  },
  {
    icon: Swords,
    title: '跨界挑战',
    description: '打破学科边界，通过精心设计的挑战任务，激发你的创新思维与问题解决能力。',
    tag: '跨学科',
    color: 'primary',
  },
  {
    icon: Sprout,
    title: '生态共建',
    description: '与志同道合的思考者共建知识生态，创造价值，共享成长，形成良性循环。',
    tag: '价值共创',
    color: 'accent',
  },
]

/**
 * 特色功能区组件
 * @returns {JSX.Element} 特色功能区
 */
export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-xf-bg to-transparent"></div>
      <div className="container mx-auto px-4 sm:px-6">
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-20 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-xf-dark mb-3 sm:mb-4">重新定义深度连接</h2>
            <p className="text-sm sm:text-lg text-xf-medium px-2 sm:px-0">相逢不仅是平台，更是思想碰撞与认知升级的催化剂</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <RevealOnScroll key={index} delay={(index + 1) * 100}>
              <div className="hover-card bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft group touch-manipulation">
                <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-xf-${feature.color}/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-xf-${feature.color}/20 transition-colors`}>
                  <feature.icon className={`w-6 sm:w-7 h-6 sm:h-7 text-xf-${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-xf-dark mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-xf-medium mb-4 sm:mb-6 leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-xf-${feature.color} bg-xf-${feature.color}/5 rounded-full border border-xf-${feature.color}/10`}>
                    {feature.tag}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
