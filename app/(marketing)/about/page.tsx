/* eslint-disable @next/next/no-img-element */
import { Twitter, Github, Mail, Sparkles, Code2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import '@/styles/domains/about.css'

export const metadata: Metadata = {
  title: '关于 · 相逢 | 独立开发者独白',
  description: '相逢 · 独立开发者故事——始于一个人，成于一群人的深度思考生态。',
}

export default function AboutPage() {
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-72 h-72 bg-xf-info/5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[15%] right-[2%] w-80 h-80 bg-xf-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/3 left-1/4 w-[800px] h-[600px] grid-bg opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
        {/* 头部标题 */}
        <div className="mb-12 md:mb-16 text-center">
          <span className="text-xf-medium text-sm tracking-widest uppercase">独立开发者 · 深度思考者</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-xf-dark mt-4 leading-tight">关于相逢<br />与创造它的人</h1>
        </div>

        {/* 左右不对称布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* 左侧：固定卡片 (粘性) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100">
                {/* 头像 */}
                <div className="flex justify-center mb-6">
                  <div className="w-36 h-36 rounded-3xl bg-xf-surface/20 border-4 border-white shadow-xl overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=独立开发者&backgroundColor=d2c3d5&radius=30"
                      alt="相逢创始人头像 - 独立开发者Ling"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-xf-dark text-center">地球-世界玩家</h2>
                <p className="text-xf-accent text-center mt-1">全栈开发 · 理念驱动</p>
                {/* 社交图标 */}
                <div className="flex justify-center gap-4 my-5">
                  <a href="#" className="p-2.5 bg-xf-light rounded-full text-xf-primary hover:bg-xf-primary hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2.5 bg-xf-light rounded-full text-xf-primary hover:bg-xf-primary hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2.5 bg-xf-light rounded-full text-xf-primary hover:bg-xf-primary hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
                <div className="border-t border-slate-100 pt-6 text-center">
                  <p className="text-xf-medium text-sm italic">&ldquo;代码是思考的延伸，社区是思想的共鸣&rdquo;</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：故事内容 */}
          <div className="lg:col-span-2 space-y-14">
            {/* 引言 */}
            <section>
              <p className="text-xl text-xf-dark/80 leading-relaxed font-serif">
                我曾是大厂的一颗螺丝，却始终怀念早期互联网的真诚与深度。2025年秋天，我决定独自搭建一个属于深度思考者的精神家园——没有流量算法，没有焦虑制造，只有认知的连接。
              </p>
              <div className="flex items-center mt-6 text-xf-medium">
                <span className="bg-xf-info/10 px-4 py-1.5 rounded-full text-sm">始于热爱</span>
                <span className="divider-dot"></span>
                <span className="bg-xf-primary/10 px-4 py-1.5 rounded-full text-sm">成于坚持</span>
                <span className="divider-dot"></span>
                <span className="bg-xf-accent/10 px-4 py-1.5 rounded-full text-sm">忠于价值</span>
              </div>
            </section>

            {/* 理念区块 */}
            <section className="bg-xf-light/50 p-8 rounded-3xl border-l-8 border-xf-primary">
              <h3 className="text-2xl font-serif font-bold text-xf-dark flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-xf-primary" />
                核心理念：价值驱动
              </h3>
              <p className="text-xf-medium leading-relaxed">
                相逢不是另一个内容平台，而是一个「认知生态系统」。创作者通过深度内容获得回报，读者通过思考获得真知，而平台只做一件事——维护这片土壤的纯粹。没有广告竞价，没有流量分成，只有基于贡献的价值循环。
              </p>
            </section>

            {/* 开发旅程 */}
            <section>
              <h3 className="text-2xl font-serif font-bold text-xf-dark flex items-center gap-3 mb-8">
                <Code2 className="w-6 h-6 text-xf-info" />
                独立开发·关键节点
              </h3>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="shrink-0 w-24 pt-1 text-xf-accent font-bold">2025.11</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">理念 &amp; 第一行代码</h4>
                    <p className="text-xf-medium text-sm mt-1">在AI的帮助下，我写下了产品文档，确立了「反算法、重连接」的原则。用Next+Tailwind搭起了第一个原型。</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-24 pt-1 text-xf-accent font-bold">2025.12</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">重新架构 · 独立开发</h4>
                    <p className="text-xf-medium text-sm mt-1">将自已的原型页面发送到微信群中帮忙验证是否符合设计。</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-24 pt-1 text-xf-accent font-bold">2026.1</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">架构生态模块</h4>
                    <p className="text-xf-medium text-sm mt-1">尝试融合智能合约，实现公开公平公正的经济生态（虽少，但意义重大）。</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-24 pt-1 text-xf-accent font-bold">2026.02</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">今日 · 仍在进化</h4>
                    <p className="text-xf-medium text-sm mt-1">每月迭代，与社区共同打磨，实现生态价值。</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 技术栈 */}
            <section className="border-t border-slate-200 pt-12">
              <h3 className="text-2xl font-serif font-bold text-xf-dark mb-6">AI+工具箱</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Tailwind</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Node.js</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Sui</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">即时设计</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Git</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Vercel</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">飞书</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Next.js</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Trae</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Gemini</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Kimi</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">Deepseek</span>
                <span className="px-5 py-2.5 bg-white rounded-full text-xf-dark border border-slate-200 shadow-sm">幕布</span>
                
              </div>
            </section>

            {/* 对社区的邀请 */}
            <section className="bg-xf-dark text-white rounded-3xl p-10 mt-10">
              <h3 className="text-3xl font-serif font-bold mb-4">一起构建深度生态</h3>
              <p className="text-slate-300 mb-8 max-w-lg">无论你是创作者、读者，还是对独立开发感兴趣的朋友，这里都有一席之地。</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="px-8 py-3 bg-white text-xf-dark rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg">
                  加入相逢
                </Link>
                <a href="mailto:ling@xiangfeng.space" className="px-8 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  给开发者写信
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
