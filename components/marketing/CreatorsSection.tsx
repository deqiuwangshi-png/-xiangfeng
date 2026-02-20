'use client'

import Image from 'next/image'
import { Star, Award, TrendingUp, Users } from 'lucide-react'
import { RevealOnScroll } from './RevealOnScroll'

export default function CreatorsSection() {
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

  return (
    <section id="creators" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-white via-xf-surface/20 to-white -z-10"></div>
      
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-16 max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-xf-dark mb-4">生态创作者网络</h2>
            <p className="text-lg text-xf-medium">加入顶尖深度思考者社区，共建知识生态系统</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="max-w-6xl mx-auto">
            <div className="glass rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <div className="p-8">
                <div className="grid grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-xf-dark mb-8 flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" /> 
                      精选创作者
                    </h3>
                    
                    <div className="space-y-6">
                      {creators.map((creator, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                              <Image
                                src={creator.avatar}
                                alt={creator.name}
                                width={56}
                                height={56}
                                className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
                                unoptimized
                                loading="eager"
                              />
                              <div className={`absolute -bottom-1 -right-1 bg-xf-${creator.tagColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                                {creator.tag}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-xf-dark text-lg">{creator.name}</h4>
                              <p className="text-sm text-xf-medium">{creator.role}</p>
                            </div>
                          </div>
                          <p className="text-xf-dark/80 italic text-sm">&ldquo;{creator.quote}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-8 border border-slate-100/50">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-xf-accent mb-1">500+</div>
                        <p className="text-xs text-xf-medium uppercase tracking-wider">认证创作者</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-xf-primary mb-1">¥28w+</div>
                        <p className="text-xs text-xf-medium uppercase tracking-wider">月度创作收益</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-xf-info mb-1">1w+</div>
                        <p className="text-xs text-xf-medium uppercase tracking-wider">协作项目</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-xf-success mb-1">94%</div>
                        <p className="text-xs text-xf-medium uppercase tracking-wider">创作者满意度</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-xf-dark mb-2">创作者支持计划</h4>
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-xf-info/10 flex items-center justify-center text-xf-info">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-xf-dark font-medium">创作基金支持</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-xf-primary/10 flex items-center justify-center text-xf-primary">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-xf-dark font-medium">内容推广资源</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-xf-accent/10 flex items-center justify-center text-xf-accent">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-xf-dark font-medium">生态协作网络</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
