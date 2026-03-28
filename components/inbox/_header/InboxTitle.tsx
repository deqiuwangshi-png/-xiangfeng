import { Bell } from '@/components/icons'

/**
 * 消息页标题组件 (Server Component)
 * @module components/inbox/_header/InboxTitle
 * @description 消息页面标题区域，服务端渲染
 * @优化说明 从InboxHeader提取为独立Server Component，减少客户端JS
 */

interface InboxTitleProps {
  /** 未读消息数量 */
  unreadCount?: number
}

/**
 * 消息页标题组件
 * @param {InboxTitleProps} props - 组件属性
 * @returns {JSX.Element} 标题组件
 */
export function InboxTitle({ unreadCount = 0 }: InboxTitleProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <h1 className="text-xl sm:text-2xl font-serif text-xf-dark font-medium flex items-center gap-2">
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-xf-primary" />
        消息通知
      </h1>
      {unreadCount > 0 && (
        <span className="px-2 py-0.5 text-xs bg-xf-primary text-white rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  )
}
