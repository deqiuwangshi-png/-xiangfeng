'use client'

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-xf-light/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 reveal max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-xf-dark mb-4">简单三步，开启旅程</h2>
          <p className="text-lg text-xf-medium">从注册到共赢，你的每一步都算数</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute top-[40px] left-[16%] right-[16%] h-0.5 bg-linear-to-r from-slate-200 via-xf-primary/30 to-slate-200 -z-10"></div>
            
            <div className="grid grid-cols-3 gap-12 relative">
              <div className="reveal delay-100 text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <span className="text-2xl font-bold text-xf-info font-serif">01</span>
                </div>
                <h3 className="text-xl font-bold text-xf-dark mb-3">注册与探索</h3>
                <p className="text-xf-medium text-sm leading-relaxed px-4">创建属于你的思考者档案，探索不同领域的深度内容与生态。</p>
              </div>

              <div className="reveal delay-200 text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <span className="text-2xl font-bold text-xf-primary font-serif">02</span>
                </div>
                <h3 className="text-xl font-bold text-xf-dark mb-3">创造与连接</h3>
                <p className="text-xf-medium text-sm leading-relaxed px-4">参与创作，连接深度思考者，建立有价值的生态关系。</p>
              </div>

              <div className="reveal delay-300 text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <span className="text-2xl font-bold text-xf-accent font-serif">03</span>
                </div>
                <h3 className="text-xl font-bold text-xf-dark mb-3">成长与共赢</h3>
                <p className="text-xf-medium text-sm leading-relaxed px-4">通过生态经济模型，实现个人成长与价值创造的真实变现。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
