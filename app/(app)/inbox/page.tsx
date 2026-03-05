import { InboxClient } from '@/components/inbox/_client/InboxClient'

/**
 * 消息页
 * @description 使用客户端组件处理交互，避免服务端/客户端边界问题
 */
export default function InboxPage() {
  return <InboxClient />
}
