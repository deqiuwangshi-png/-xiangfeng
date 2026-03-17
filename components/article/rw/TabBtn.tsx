'use client'

/**
 * 选项卡按钮组件
 * @module components/article/rw/TabBtn
 * @description 打赏弹窗中的选项卡切换按钮
 */

import type { TabBtnProps } from '@/types'

/**
 * 选项卡按钮组件
 * @param {TabBtnProps} props - 组件属性
 * @returns {JSX.Element} 选项卡按钮
 */
export function TabBtn({ active, onClick, icon, label, disabled }: TabBtnProps) {
  return (
    <button
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed text-xf-medium'
          : active
            ? 'bg-white text-xf-primary shadow-sm'
            : 'text-xf-medium hover:text-xf-dark'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {label}
    </button>
  )
}
