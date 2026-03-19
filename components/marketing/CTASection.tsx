/**
 * CTA行动号召区组件
 * @module components/marketing/CTASection
 * @description 响应式CTA区域，移动端优化
 */

'use client'

import { useRouter } from 'next/navigation'
import { RevealOnScroll } from './RevealOnScroll'

/**
 * CTA行动号召区组件
 * @returns {JSX.Element} CTA区域
 */
export default function CTASection() {
  const router = useRouter()

  return (
    <section className="py-12 sm:py-20 bg-xf-light/50">
      <RevealOnScroll>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-elevated max-w-4xl mx-auto border border-white/50">
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-xf-dark mb-4 sm:mb-6">准备好加入生态了吗？</h2>
            <p className="text-sm sm:text-lg text-xf-medium mb-6 sm:mb-10 max-w-2xl mx-auto">加入相逢，成为知识生态系统的一部分，共同创造价值，共享成长</p>

            <button
              onClick={() => router.push('/login')}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-xf-primary hover:bg-xf-accent text-white rounded-xl sm:rounded-2xl font-semibold text-lg sm:text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 touch-manipulation"
            >
              立即开始
            </button>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  )
}
