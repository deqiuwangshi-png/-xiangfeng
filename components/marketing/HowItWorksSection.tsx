/**
 * 如何运作区组件 (Server Component)
 * @module components/marketing/HowItWorksSection
 * @description 响应式步骤展示，移动端垂直布局
 * @优化说明 改为Server Component，动画部分使用客户端组件包裹
 */

import { RevealOnScrollClient } from './RevealOnScrollClient'

/**
 * 步骤数据
 * @constant steps
 */
const steps = [
  {
    number: '01',
    title: '注册与探索',
    description: '创建属于你的思考者档案，探索不同领域的深度内容与生态。',
    color: 'info',
  },
  {
    number: '02',
    title: '创造与连接',
    description: '参与创作，连接深度思考者，建立有价值的生态关系。',
    color: 'primary',
  },
  {
    number: '03',
    title: '成长与共赢',
    description: '通过生态经济模型，实现个人成长与价值创造的真实变现。',
    color: 'accent',
  },
]

/**
 * 如何运作区组件
 * @returns {JSX.Element} 如何运作区
 */
export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 sm:py-24 bg-xf-light/30">
      <div className="container mx-auto px-4 sm:px-6">
        <RevealOnScrollClient>
          <div className="text-center mb-10 sm:mb-20 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-xf-dark mb-3 sm:mb-4">简单三步，开启旅程</h2>
            <p className="text-sm sm:text-lg text-xf-medium">从注册到共赢，你的每一步都算数</p>
          </div>
        </RevealOnScrollClient>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* 桌面端连接线 - 移动端隐藏 */}
            <div className="hidden sm:block absolute top-[40px] left-[16%] right-[16%] h-0.5 bg-linear-to-r from-slate-200 via-xf-primary/30 to-slate-200 -z-10"></div>

            {/* 移动端垂直连接线 */}
            <div className="sm:hidden absolute top-0 bottom-0 left-[28px] w-0.5 bg-linear-to-b from-slate-200 via-xf-primary/30 to-slate-200 -z-10"></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 relative">
              {steps.map((step, index) => (
                <RevealOnScrollClient key={step.number} delay={(index + 1) * 100}>
                  <div className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 group">
                    {/* 步骤编号 */}
                    <div className={`w-14 sm:w-20 h-14 sm:h-20 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-soft group-hover:scale-110 transition-transform duration-300 relative z-10 touch-manipulation`}>
                      <span className={`text-xl sm:text-2xl font-bold text-xf-${step.color} font-serif`}>{step.number}</span>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 sm:text-center sm:mt-6">
                      <h3 className="text-lg sm:text-xl font-bold text-xf-dark mb-1 sm:mb-3">{step.title}</h3>
                      <p className="text-xf-medium text-sm leading-relaxed sm:px-4">{step.description}</p>
                    </div>
                  </div>
                </RevealOnScrollClient>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
