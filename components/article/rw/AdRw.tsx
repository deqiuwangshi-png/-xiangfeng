'use client'

/**
 * 广告打赏面板
 * @module components/article/rw/AdRw
 * @description 广告打赏选项面板（暂未开放）
 */

import { Clock } from '@/components/icons'

/**
 * 广告打赏面板
 * @returns {JSX.Element} 广告打赏面板
 */
export function AdRw() {
  return (
    <div className="space-y-4">
      <div className="bg-xf-info/10 rounded-xl p-6 text-center border border-xf-info/20">
        <Clock className="w-12 h-12 mx-auto mb-3 text-xf-info opacity-80" />
        <h4 className="text-lg font-bold mb-2 text-xf-dark">即将开放</h4>
        <p className="text-sm text-xf-medium">
          广告打赏功能正在开发中<br />
          敬请期待！
        </p>
      </div>
      <button
        className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
        disabled
      >
        暂时不可用
      </button>
    </div>
  )
}
