import { InboxClient } from '@/components/inbox/_client/InboxClient'
import { getCurrentUserWithProfile } from '@/lib/auth/server'
import { UnauthenticatedPrompt } from '@/components/auth/guards/UnauthenticatedPrompt'
import { Bell } from 'lucide-react'

/**
 * 消息页
 * @description 使用客户端组件处理交互，避免服务端/客户端边界问题
 * 从服务端获取用户信息并传递给客户端，解决 session 丢失问题
 *
 * @统一认证 2026-03-30
 * - 页面自行处理未登录状态，显示友好的登录引导
 * - 使用 UnauthenticatedPrompt 组件展示洞察图标和登录按钮
 */
export default async function InboxPage() {
  const profile = await getCurrentUserWithProfile()

  // 未登录用户：显示登录引导
  if (!profile) {
    return (
      <UnauthenticatedPrompt
        title="消息通知"
        description="接收评论回复、点赞关注和系统通知"
        icon={<Bell className="w-8 h-8 sm:w-10 sm:h-10 text-xf-primary" />}
        promptText="登录后查看你的消息通知"
      />
    )
  }

  return <InboxClient userId={profile.id} />
}
