'use client'

import { useRouter } from 'next/navigation'
import { DollarSign, RefreshCw, Clock, Check } from 'lucide-react'
import { RevealOnScroll } from './RevealOnScroll'

export default function EconomySection() {
  const router = useRouter()

  const creatorBenefits = [
    { label: '内容价值指数', value: '深度推荐' },
    { label: '生态贡献认证', value: '专属徽章' },
    { label: '协作项目分成', value: '解决现实' },
  ]

  const readerBenefits = [
    '免费阅读基础内容',
    '订阅深度专栏',
    '参与价值评估与投票',
  ]

  return (
    <section id="economy" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-16 max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-xf-dark mb-4">价值驱动的生态经济</h2>
            <p className="text-lg text-xf-medium">拒绝流量算法，回归价值本质</p>
          </div>
        </RevealOnScroll>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6 mb-16">
            <RevealOnScroll delay={100}>
              <div className="bg-xf-light/50 rounded-2xl p-8 border border-slate-100">
                <DollarSign className="w-8 h-8 text-xf-info mb-4" />
                <h3 className="text-xl font-bold text-xf-dark mb-2">价值创造</h3>
                <p className="text-xf-medium text-sm">深度思考与知识分享创造真实价值，而非依赖广告或流量变现。</p>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200}>
              <div className="bg-xf-light/50 rounded-2xl p-8 border border-slate-100">
                <RefreshCw className="w-8 h-8 text-xf-primary mb-4" />
                <h3 className="text-xl font-bold text-xf-dark mb-2">生态循环</h3>
                <p className="text-xf-medium text-sm">价值在创作者、读者和平台间循环流动，形成可持续的良性生态。</p>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={300}>
              <div className="bg-xf-light/50 rounded-2xl p-8 border border-slate-100">
                <Clock className="w-8 h-8 text-xf-accent mb-4" />
                <h3 className="text-xl font-bold text-xf-dark mb-2">长期主义</h3>
                <p className="text-xf-medium text-sm">鼓励深度思考与持续创造，而非短期流量与热点追逐。</p>
              </div>
            </RevealOnScroll>
          </div>
          
          <RevealOnScroll delay={200}>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col bg-white rounded-3xl p-8 border-2 border-xf-bg shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-serif font-bold text-xf-dark">创作者</h3>
                  <span className="bg-xf-primary/10 text-xf-primary text-xs font-bold px-3 py-1 rounded-full">Pro</span>
                </div>
                <ul className="space-y-5 mb-8">
                  {creatorBenefits.map((benefit) => (
                    <li key={benefit.label} className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-xf-medium">{benefit.label}</span>
                      <span className="font-bold text-xf-dark">{benefit.value}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 bg-xf-light hover:bg-slate-200 text-xf-dark rounded-xl font-medium transition-colors mt-auto"
                >
                  申请成为创作者
                </button>
              </div>
              
              <div className="flex flex-col bg-xf-primary rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-2xl font-serif font-bold">读者参与</h3>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Open</span>
                </div>
                <ul className="space-y-5 mb-8 relative z-10">
                  {readerBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="opacity-90">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 bg-white text-xf-primary hover:bg-slate-50 rounded-xl font-bold transition-colors shadow-md mt-auto"
                >
                  立即免费加入
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
