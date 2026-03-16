import { InboxClient } from '@/components/inbox/_client/InboxClient'
import { getCurrentUserWithProfile } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'

/**
 * 消息页
 * @description 使用客户端组件处理交互，避免服务端/客户端边界问题
 * 从服务端获取用户信息并传递给客户端，解决 session 丢失问题
 */
export default async function InboxPage() {
  const profile = await getCurrentUserWithProfile()

  if (!profile) {
    redirect('/login')
  }

  return <InboxClient userId={profile.id} />
}
