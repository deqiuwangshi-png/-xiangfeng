/**
 * 页脚组件 - 服务端组件
 * @module components/marketing/Footer
 * @description 响应式页脚，移动端优化布局
 * 纯展示，无客户端交互
 * 服务端渲染，SEO友好
 */

import { Github } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/icons'

/**
 * 页脚组件
 * @returns {JSX.Element} 页脚
 */
export default function Footer() {
  return (
    <footer className="bg-xf-dark text-white pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Logo和简介 */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Logo size="sm" />
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              相逢是一个价值驱动的深度思考者生态，致力于构建可持续的知识经济生态系统。
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors touch-manipulation" aria-label="Github">
                <Github className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
            </div>
          </div>

          {/* 关于产品 */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">关于产品</h4>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-white transition-colors">
                  品牌合作
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持帮助 */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">支持帮助</h4>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
              <li>
                <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-300 transition-colors">
                  服务条款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
          <p className="text-center sm:text-left">© 2026 相逢 不止相遇，更是改变世界</p>
        </div>
      </div>
    </footer>
  )
}
