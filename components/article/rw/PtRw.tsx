'use client'

/**
 * 积分打赏面板
 * @module components/article/rw/PtRw
 * @description 积分打赏选项面板，接入真实 API
 */

import { useState, useCallback } from 'react'
import { Loader2, Wallet } from '@/components/icons'
import type { PtRwProps } from '@/types'
import { usePoints } from '@/hooks/rewards/usePoints'
import { rewardArticle, getRewardNonce } from '@/lib/rewards'
import { useArticleToast } from '@/hooks/article/useArticleToast'

/**
 * 积分打赏面板
 * @param {PtRwProps} props - 组件属性
 * @returns {JSX.Element} 积分打赏面板
 */
export function PtRw({ articleId, authorId, onSuccess }: PtRwProps) {
  const pointsOptions = [10, 50, 100, 500]
  const [selectedPoints, setSelectedPoints] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showSuccess } = useArticleToast()

  const { overview, refreshPoints } = usePoints()
  const userPoints = overview?.current_points || 0
  const canAfford = userPoints >= selectedPoints

  /**
   * 处理打赏
   */
  const handleReward = useCallback(async () => {
    if (!canAfford) {
      setError('积分不足')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 获取 nonce
      const { nonce } = await getRewardNonce()
      if (!nonce) {
        setError('请先登录')
        return
      }

      // 执行打赏
      const result = await rewardArticle({
        articleId,
        authorId,
        points: selectedPoints,
        nonce,
      })

      if (result.success) {
        // 刷新积分显示（强制重新验证）
        await refreshPoints()
        // 触发全局积分更新事件
        window.dispatchEvent(new CustomEvent('points:updated'))
        // 显示成功提示
        showSuccess('打赏', false, `赠送了 ${selectedPoints} 积分给作者`)
        // 成功回调
        onSuccess?.()
      } else {
        setError(result.error || '打赏失败')
      }
    } catch{
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }, [canAfford, articleId, authorId, selectedPoints, refreshPoints, showSuccess, onSuccess])

  return (
    <div className="space-y-4">
      {/* 积分余额显示 */}
      <div className="flex items-center justify-center gap-2 text-sm text-xf-medium">
        <Wallet className="w-4 h-4" />
        <span>我的灵感币：</span>
        <span className="font-bold text-xf-accent">{userPoints}</span>
      </div>

      <p className="text-sm text-xf-medium text-center">选择打赏积分数量</p>
      
      {/* 积分选项 */}
      <div className="grid grid-cols-4 gap-3">
        {pointsOptions.map((points) => (
          <button
            key={points}
            disabled={isLoading}
            className={`py-3 px-2 rounded-xl border-2 transition-all disabled:opacity-50 ${
              selectedPoints === points
                ? 'border-xf-primary bg-xf-surface/30 text-xf-primary'
                : userPoints < points
                  ? 'border-xf-bg opacity-50 cursor-not-allowed'
                  : 'border-xf-bg hover:border-xf-primary/50'
            }`}
            onClick={() => userPoints >= points && setSelectedPoints(points)}
          >
            <div className="text-lg font-bold">{points}</div>
            <div className="text-xs text-xf-medium">积分</div>
          </button>
        ))}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="text-sm text-rose-500 text-center">{error}</div>
      )}

      {/* 打赏按钮 */}
      <button
        className="w-full py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        onClick={handleReward}
        disabled={isLoading || !canAfford}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            打赏中...
          </>
        ) : !canAfford ? (
          '积分不足'
        ) : (
          `打赏 ${selectedPoints} 积分`
        )}
      </button>

      {/* 每日上限提示 */}
      <p className="text-xs text-xf-medium text-center">
        每日打赏上限：1000 积分
      </p>
    </div>
  )
}
