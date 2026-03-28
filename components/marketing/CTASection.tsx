/**
 * CTA行动号召区组件 (Server Component)
 * @module components/marketing/CTASection
 * @description 响应式CTA区域，移动端优化
 * @优化说明 改为Server Component，移除'use client'，使用Link组件
 */

import Link from 'next/link'
import { RevealOnScrollClient } from './RevealOnScrollClient'

/**
 * CTA行动号召区组件
 * @returns {JSX.Element} CTA区域
 */
export default function CTASection() {
  return (
    <section className="py-12 sm:py-20 bg-xf-light/50">
      <RevealOnScrollClient>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-elevated max-w-4xl mx-auto border border-white/50">
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-xf-dark mb-4 sm:mb-6">准备好加入生态了吗？</h2>
            <p className="text-sm sm:text-lg text-xf-medium mb-6 sm:mb-10 max-w-2xl mx-auto">加入相逢，成为知识生态系统的一部分，共同创造价值，共享成长</p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/register"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-xf-dark hover:bg-xf-accent text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 inline-flex items-center justify-center"
              >
                立即加入
              </Link>
              <Link
                href="/about"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-xf-light text-xf-dark border border-xf-bg rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all inline-flex items-center justify-center"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScrollClient>
    </section>
  )
}
