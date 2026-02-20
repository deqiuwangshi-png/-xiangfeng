'use client'

import { ArrowRight, BrainCircuit, Sparkles, Users, GitMerge } from 'lucide-react'
import { RevealOnScroll } from './RevealOnScroll'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-xf-info/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-xf-primary/15 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1000px] grid-bg opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-xf-info opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-xf-info"></span>
              </span>
              <span className="text-xs font-semibold text-xf-accent tracking-wide uppercase">深度思考者的精神家园</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <h1 className="text-5xl font-serif font-bold mb-6 leading-tight text-xf-dark">
              <span className="text-xf-accent">不止相遇</span>
              <span className="block mt-2">更是<span className="text-xf-info relative inline-block">改变<svg className="absolute w-full h-3 -bottom-1 left-0 text-xf-info/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none"/></svg></span></span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="text-lg text-xf-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              在嘈杂的信息流中寻找深度连接。打破认知边界，构建属于你的思维网络，与志同道合者共创价值。
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="flex gap-4 justify-center mb-16">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-8 py-4 bg-xf-dark hover:bg-xf-accent text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                开启深度之旅 <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/80 hover:bg-white border border-xf-bg text-xf-dark rounded-2xl font-semibold text-lg transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                探索特色
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="relative max-w-5xl mx-auto mt-12">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/40 backdrop-blur-sm p-2">
                <div className="bg-xf-light rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-8 opacity-80">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-xf-primary rounded-xl flex items-center justify-center shadow-md">
                          <GitMerge className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 w-24 bg-slate-300 rounded-full"></div>
                          <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                      <div className="h-40 bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-xf-soft/20 text-xf-info flex items-center justify-center mb-2">
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-3/4 bg-slate-200 rounded-full group-hover:bg-xf-soft/50 transition-colors"></div>
                          <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                          <div className="h-2 w-2/3 bg-slate-100 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-40 bg-white rounded-xl p-5 shadow-md border border-xf-primary/10 flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-lg bg-xf-primary/20 text-xf-primary flex items-center justify-center mb-2">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-4/5 bg-xf-primary/20 rounded-full"></div>
                          <div className="h-2 w-full bg-xf-primary/10 rounded-full"></div>
                          <div className="h-2 w-5/6 bg-xf-primary/10 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-40 bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-xf-accent/10 text-xf-accent flex items-center justify-center mb-2">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-2/3 bg-slate-200 rounded-full group-hover:bg-xf-accent/20 transition-colors"></div>
                          <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 h-24 w-full bg-white/60 rounded-xl border border-slate-100"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 w-24 h-24 bg-linear-to-br from-xf-soft to-xf-primary/30 rounded-full blur-xl opacity-60 animate-blob"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-linear-to-tr from-xf-surface to-xf-accent/20 rounded-full blur-xl opacity-60 animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
