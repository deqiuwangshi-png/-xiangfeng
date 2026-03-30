import { Handshake, TrendingUp, Users, Mail, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import '@/styles/about.css'

export default function PartnersPage() {
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
          <span className="text-xf-medium text-sm tracking-widest uppercase">深度合作 · 价值共赢</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-xf-dark mt-4 leading-tight">品牌合作<br />与思考者共创</h1>
        </div>

        {/* 左右不对称布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* 左侧：固定卡片 (粘性) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100">
                {/* 合作图标 */}
                <div className="flex justify-center mb-6">
                  <div className="w-36 h-36 rounded-3xl bg-xf-surface/20 border-4 border-white shadow-xl flex items-center justify-center">
                    <Handshake className="w-16 h-16 text-xf-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-xf-dark text-center">品牌合作</h2>
                <p className="text-xf-accent text-center mt-1">与深度思考者生态共赢</p>
                {/* 联系信息 */}
                <div className="border-t border-slate-100 pt-6 mt-6">
                  <h3 className="font-bold text-xf-dark mb-4 text-center">立即联系</h3>
                  <div className="flex flex-col gap-3">
                    <a href="mailto:1641633140@qq.com" className="w-full py-3 bg-xf-info/10 text-xf-info rounded-xl font-medium border border-xf-info/20 hover:bg-xf-info hover:text-white transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      邮件联系
                    </a>
                    <Link href="/" className="w-full py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-accent transition-colors block text-center">
                      返回
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：合作内容 */}
          <div className="lg:col-span-2 space-y-14">
            {/* 引言 */}
            <section>
              <p className="text-xl text-xf-dark/80 leading-relaxed font-serif">
                相逢是一个价值驱动的深度思考者生态，我们寻找志同道合的品牌伙伴，共同构建有意义的连接，为思考者创造价值，为品牌带来深度影响力。
              </p>
              <div className="flex items-center mt-6 text-xf-medium">
                <span className="bg-xf-info/10 px-4 py-1.5 rounded-full text-sm">深度连接</span>
                <span className="divider-dot"></span>
                <span className="bg-xf-primary/10 px-4 py-1.5 rounded-full text-sm">价值共赢</span>
                <span className="divider-dot"></span>
                <span className="bg-xf-accent/10 px-4 py-1.5 rounded-full text-sm">长期合作</span>
              </div>
            </section>

            {/* 合作价值 */}
            <section className="bg-xf-light/50 p-8 rounded-3xl border-l-8 border-xf-primary">
              <h3 className="text-2xl font-serif font-bold text-xf-dark flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-xf-primary" />
                合作价值
              </h3>
              <ul className="space-y-4 text-xf-medium leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-xf-primary/20 flex items-center justify-center">
                    <span className="text-xf-primary font-bold text-xs">✓</span>
                  </div>
                  <span>接触高质量的深度思考者群体，精准触达目标受众</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-xf-primary/20 flex items-center justify-center">
                    <span className="text-xf-primary font-bold text-xs">✓</span>
                  </div>
                  <span>通过有意义的内容合作，提升品牌专业形象和可信度</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-xf-primary/20 flex items-center justify-center">
                    <span className="text-xf-primary font-bold text-xs">✓</span>
                  </div>
                  <span>与独立开发者直接合作，获得技术与创意的双重支持</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-xf-primary/20 flex items-center justify-center">
                    <span className="text-xf-primary font-bold text-xs">✓</span>
                  </div>
                  <span>参与构建可持续的知识经济生态，实现长期品牌价值</span>
                </li>
              </ul>
            </section>

            {/* 合作形式 */}
            <section>
              <h3 className="text-2xl font-serif font-bold text-xf-dark flex items-center gap-3 mb-8">
                <Zap className="w-6 h-6 text-xf-info" />
                合作形式
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-xf-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-xf-primary" />
                  </div>
                  <h4 className="font-bold text-xf-dark text-lg mb-3">内容合作</h4>
                  <p className="text-xf-medium text-sm">共同创作深度内容，通过文章、案例研究等形式展示品牌价值</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-xf-info/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-xf-info" />
                  </div>
                  <h4 className="font-bold text-xf-dark text-lg mb-3">社区活动</h4>
                  <p className="text-xf-medium text-sm">举办线上线下活动，连接品牌与思考者社区，增强互动与参与</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-xf-accent/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-xf-accent" />
                  </div>
                  <h4 className="font-bold text-xf-dark text-lg mb-3">技术合作</h4>
                  <p className="text-xf-medium text-sm">基于Supabase和Next.js技术栈，共同开发创新功能和解决方案</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-xf-medium/10 flex items-center justify-center mb-4">
                    <Handshake className="w-6 h-6 text-xf-medium" />
                  </div>
                  <h4 className="font-bold text-xf-dark text-lg mb-3">品牌赞助</h4>
                  <p className="text-xf-medium text-sm">通过赞助社区活动、内容创作等方式，提升品牌在思考者群体中的影响力</p>
                </div>
              </div>
            </section>

            {/* 合作流程 */}
            <section>
              <h3 className="text-2xl font-serif font-bold text-xf-dark flex items-center gap-3 mb-8">
                <Handshake className="w-6 h-6 text-xf-primary" />
                合作流程
              </h3>
              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center text-xf-primary font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">初步沟通</h4>
                    <p className="text-xf-medium text-sm mt-1">通过邮件或表单提交合作意向，我们将在24小时内回复</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center text-xf-primary font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">需求分析</h4>
                    <p className="text-xf-medium text-sm mt-1">深入了解品牌需求和目标，制定个性化合作方案</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center text-xf-primary font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">方案确认</h4>
                    <p className="text-xf-medium text-sm mt-1">双方确认合作细节、时间节点和预期成果</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center text-xf-primary font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">项目执行</h4>
                    <p className="text-xf-medium text-sm mt-1">按照既定方案执行合作项目，定期沟通进度</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-xf-primary/10 flex items-center justify-center text-xf-primary font-bold">5</div>
                  <div>
                    <h4 className="font-bold text-xf-dark">效果评估</h4>
                    <p className="text-xf-medium text-sm mt-1">合作完成后，评估效果并探讨长期合作机会</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 合作邀请 */}
            <section className="bg-xf-dark text-white rounded-3xl p-10 mt-10">
              <h3 className="text-3xl font-serif font-bold mb-4">开启深度合作</h3>
              <p className="text-slate-300 mb-8 max-w-lg">无论您是科技公司、教育机构还是创意品牌，我们都期待与您共同探索深度合作的可能性。</p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:partners@xiangfeng.space" className="px-8 py-3 bg-white text-xf-dark rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg">
                  立即联系
                </a>
                <Link href="/about" className="px-8 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  了解关于
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
