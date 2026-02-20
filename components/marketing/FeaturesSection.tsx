'use client'

import { Network, Swords, Sprout } from 'lucide-react'

export default function FeaturesSection() {
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

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-xf-bg to-transparent"></div>
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 reveal max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-xf-dark mb-4">重新定义深度连接</h2>
          <p className="text-lg text-xf-medium">相逢不仅是平台，更是思想碰撞与认知升级的催化剂</p>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`reveal delay-${(index + 1) * 100} hover-card bg-white rounded-3xl p-8 border border-slate-100 shadow-soft group`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-xf-${feature.color}/10 flex items-center justify-center mb-6 group-hover:bg-xf-${feature.color}/20 transition-colors`}>
                <feature.icon className={`w-7 h-7 text-xf-${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-xf-dark mb-3">{feature.title}</h3>
              <p className="text-xf-medium mb-6 leading-relaxed">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-xs font-medium text-xf-${feature.color} bg-xf-${feature.color}/5 rounded-full border border-xf-${feature.color}/10`}>
                  {feature.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
