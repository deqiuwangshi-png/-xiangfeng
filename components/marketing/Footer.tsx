'use client'

import { GitMerge, Twitter, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-xf-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-xf-primary rounded-lg flex items-center justify-center">
                <GitMerge className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold">相逢</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
              相逢是一个价值驱动的深度思考者生态，致力于构建可持续的知识经济生态系统。
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors" aria-label="Github">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">关于产品</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  关于我们
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-white transition-colors">
                  品牌合作
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">支持帮助</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="privacy" className="hover:text-slate-300 transition-colors">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="terms" className="hover:text-slate-300 transition-colors">
                  服务条款
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 相逢 不止相遇，更是改变世界</p>
        </div>
      </div>
    </footer>
  )
}
