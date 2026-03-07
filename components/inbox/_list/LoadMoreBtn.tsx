'use client'

import { Loader } from '@/components/icons'

/**
 * 加载更多按钮组件属性接口
 * @interface LoadMoreBtnProps
 * @property {() => void} onClick - 点击回调函数
 */
interface LoadMoreBtnProps {
  onClick: () => void
}

/**
 * 加载更多按钮组件
 * @description 列表底部加载更多按钮
 * @param {LoadMoreBtnProps} props - 组件属性
 * @returns {JSX.Element} 按钮组件
 */
export function LoadMoreBtn({ onClick }: LoadMoreBtnProps) {
  return (
    <div className="flex justify-center pt-4">
      <button
        className="text-sm text-gray-400 hover:text-xf-primary transition flex items-center gap-1"
        onClick={onClick}
      >
        <Loader className="w-4 h-4" />
        加载更多
      </button>
    </div>
  )
}
