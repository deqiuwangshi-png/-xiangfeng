'use client'

/**
 * 积分商城错误边界
 * @module components/rewards/shop/ShopError
 * @description 捕获积分商城页面的错误，提供友好的错误提示
 */

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from '@/components/icons'

interface ErrorProps {
  /** 错误对象 */
  error: Error & { digest?: string }
  /** 重置函数 */
  reset: () => void
}

/**
 * 错误边界组件
 * @param {ErrorProps} props - 组件属性
 * @returns {JSX.Element} 错误提示界面
 */
export default function ShopError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 记录错误到日志服务
    console.error('积分商城页面错误:', error)
  }, [error])

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-8 pb-12">
        <div className="card-bg rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-xf-dark mb-2">
            页面加载失败
          </h2>
          <p className="text-xf-primary mb-6">
            {error.message || '加载商品列表时出现问题，请稍后重试'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-xf-accent text-white rounded-full hover:bg-xf-accent/90 transition"
            >
              <RefreshCw className="w-4 h-4" />
              重新加载
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
