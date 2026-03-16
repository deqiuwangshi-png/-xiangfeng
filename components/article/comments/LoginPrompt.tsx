import { MessageCircle } from '@/components/icons'
import type { LoginPromptProps } from './types'

/**
 * 登录提示组件 - 服务端组件
 * ✅ 纯展示，无客户端状态
 * ✅ 链接使用标准 <a> 标签，无需客户端路由
 *
 * @param hiddenCount - 隐藏的评论数量
 * @returns 登录提示JSX
 */
export function LoginPrompt({ hiddenCount }: LoginPromptProps) {
  return (
    <div className="relative">
      {/* 渐变遮罩 */}
      <div className="absolute -top-20 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent pointer-events-none" />

      {/* 登录提示卡片 */}
      <div className="bg-linear-to-br from-xf-primary/5 to-xf-accent/5 border border-xf-primary/10 rounded-2xl p-6 text-center mt-4">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 text-xf-primary/60" />
        <p className="text-xf-dark font-medium mb-2">还有 {hiddenCount} 条评论</p>
        <p className="text-sm text-xf-medium mb-4">
          登录后即可查看全部评论并参与讨论
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-accent transition-colors"
        >
          立即登录
        </a>
      </div>
    </div>
  )
}
