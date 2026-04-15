import { InboxClient } from '@/components/inbox/InboxClient'
import { requireAuth } from '@/lib/auth/server'

/**
 * 消息页
 * @description 使用客户端组件处理交互，避免服务端/客户端边界问题
 * 从服务端获取用户信息并传递给客户端，解决 session 丢失问题
 */
export default async function InboxPage() {
  const user = await requireAuth()

  return <InboxClient userId={user.id} />
}
