/**
 * 创作者区组件 (Server Component)
 * @module components/marketing/CreatorsSection
 * @description 响应式创作者展示，移动端优化布局
 * @优化说明 改为Server Component，动画部分使用客户端组件包裹
 */

import Image from 'next/image'
import { Star, Award, TrendingUp, Users, BookOpen, FolderKanban, Lightbulb } from 'lucide-react'
import { RevealOnScrollClient } from './RevealOnScrollClient'

/**
 * 创作者数据
 * @constant creators
 */
const creators = [
  {
    name: 'Sophie Chen',
    role: '哲学研究者 · 12篇深度文章',
    tag: '哲学',
    tagColor: 'primary',
    quote: '在相逢找到了久违的思想碰撞，这里的创作生态让我能够专注于深度思考。',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sophie&backgroundColor=E1E4EA',
  },
  {
    name: 'Alex Wang',
    role: '产品设计师 · 8个跨界项目',
    tag: '设计',
    tagColor: 'accent',
    quote: '相逢的生态经济模型让创作者能够真正专注于内容质量，而非流量焦虑。',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=D2C3D5',
  },
]

/**
 * 统计卡片数据
 * @constant stats
 */
const stats = [
  { value: '500+', label: '认证创作者', color: 'accent' },
  { value: '¥28w+', label: '月度创作收益', color: 'primary' },
  { value: '1w+', label: '累计订阅', color: 'info' },
  { value: '94%', label: '创作者满意度', color: 'success' },
]

/**
 * 支持计划数据
 * @constant supportPlans
 */
const supportPlans = [
  { icon: Award, label: '平台长期支持', color: 'info' },
  { icon: TrendingUp, label: '内容推广资源', color: 'primary' },
  { icon: Users, label: '生态协作网络', color: 'accent' },
  { icon: FolderKanban, label: '知识体系整理', color: 'success' },
  { icon: BookOpen, label: '深度阅读专属', color: 'warning' },
  { icon: Lightbulb, label: '思考经验沉淀', color: 'danger' },
]

/**
 * 创作者区组件
 */
export default function CreatorsSection() {
  return (
    <section id="creators" className="py-12 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-white via-xf-surface/20 to-white -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6">
        <RevealOnScrollClient>
          <div className="text-center mb-10 sm:mb-16 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-xf-dark mb-3 sm:mb-4">生态创作者网络</h2>
            <p className="text-sm sm:text-lg text-xf-medium">加入顶尖深度思考者社区，共建知识生态系统</p>
          </div>
        </RevealOnScrollClient>

        <RevealOnScrollClient delay={100}>
          <div className="max-w-6xl mx-auto">
            <div className="glass rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl ring-1 ring-black/5">
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
                  {/* 左侧创作者列表 */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-xf-dark mb-4 sm:mb-8 flex items-center gap-2">
                      <Star className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500 fill-current" />
                      精选创作者
                    </h3>

                    <div className="space-y-4 sm:space-y-6">
                      {creators.map((creator) => (
                        <div key={creator.name} className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="relative shrink-0">
                              <Image
                                src={creator.avatar}
                                alt={creator.name}
                                width={48}
                                height={48}
                                className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-white shadow-sm"
                                loading="eager"
                                unoptimized={creator.avatar?.includes('dicebear.com')}
                              />
                              <div className={`absolute -bottom-1 -right-1 bg-xf-${creator.tagColor} text-white text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full`}>
                                {creator.tag}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xf-dark text-base sm:text-lg truncate">{creator.name}</h4>
                              <p className="text-xs sm:text-sm text-xf-medium truncate">{creator.role}</p>
                            </div>
                          </div>
                          <p className="text-xf-dark/80 italic text-xs sm:text-sm">&ldquo;{creator.quote}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 右侧统计数据 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-100/50">
                    {/* 统计卡片网格 */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
                      {stats.map((stat) => (
                        <div key={stat.label} className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm">
                          <div className={`text-2xl sm:text-3xl font-bold text-xf-${stat.color} mb-1`}>{stat.value}</div>
                          <p className="text-[10px] sm:text-xs text-xf-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* 支持计划 - 三行两列布局 */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {supportPlans.map((plan) => (
                        <div key={plan.label} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/50 rounded-lg touch-manipulation">
                          <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-xf-${plan.color}/10 flex items-center justify-center text-xf-${plan.color} flex-shrink-0`}>
                            <plan.icon className="w-3 sm:w-4 h-3 sm:h-4" />
                          </div>
                          <span className="text-[10px] sm:text-sm text-xf-dark font-medium leading-tight">{plan.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScrollClient>
      </div>
    </section>
  )
}
