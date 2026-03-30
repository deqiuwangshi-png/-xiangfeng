import { InboxClient } from '@/components/inbox/_client/InboxClient'
import { AuthRequiredContent } from '@/components/auth/guards/AuthRequiredContent'
import { getCurrentUserWithProfile } from '@/lib/auth/user'

/**
 * 消息页
 * @description 使用客户端组件处理交互，避免服务端/客户端边界问题
 * 从服务端获取用户信息并传递给客户端，解决 session 丢失问题
 * 支持未登录状态显示登录引导
 */
export default async function InboxPage() {
  const profile = await getCurrentUserWithProfile()

  {/* 未登录状态：显示登录引导 */}
  if (!profile) {
    return (
      <AuthRequiredContent
        title="消息中心"
        description="登录后查看你的消息通知"
      />
    )
  }

  return <InboxClient userId={profile.id} />
}
