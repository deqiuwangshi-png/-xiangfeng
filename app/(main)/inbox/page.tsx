import { InboxClient } from '@/components/inbox/_client/InboxClient'
import { getCurrentUserWithProfile } from '@/lib/auth/user'

/**
 * 消息页
 * @description 使用客户端组件处理交互，避免服务端/客户端边界问题
 * 从服务端获取用户信息并传递给客户端，解决 session 丢失问题
 *
 * @统一认证 2026-03-30
 * - 认证检查已移至 (main)/layout.tsx
 * - 此页面不再需要单独检查登录状态
 */
export default async function InboxPage() {
  const profile = await getCurrentUserWithProfile()

  // Layout 层已拦截未登录用户，此处 profile 理论上不会为 null
  if (!profile) {
    throw new Error('用户未登录')
  }

  return <InboxClient userId={profile.id} />
}
