'use client'
import { useState } from 'react'
import { AlertTriangle, Power, X } from '@/components/icons'
import { deactivateAccount } from '@/lib/user/deactivateAccount'
import { clearClientAuthStorage } from '@/lib/auth/clearClientAuthStorage'
import { getMarketingHomeUrl } from '@/lib/seo'

/**
 * 停用账户卡片组件
 *
 * @returns {JSX.Element} 停用账户卡片组件
 *
 * @description
 * 提供账户停用功能：
 * - 显示停用账户按钮
 * - 点击后弹出确认弹窗
 * - 确认后停用账户并退出登录
 *
 * 业务规则：
 * - 停用后数据保留，文章对外不可见
 * - 重新登录自动激活账户
 */
export function DeactivateAccountCard() {
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 处理停用账户
   *
   * @returns {Promise<void>}
   *
   * @description
   * 调用服务端停用账户API，成功后跳转到首页
   */
  const handleDeactivate = async () => {
    setIsLoading(true)
    setError(null)

    const result = await deactivateAccount()

    if (result.success) {
      clearClientAuthStorage()
      window.location.assign(getMarketingHomeUrl())
    } else {
      setError(result.error || '停用失败')
      setIsLoading(false)
    }
  }

  /**
   * 处理关闭弹窗
   *
   * @returns {void}
   */
  const handleClose = () => {
    if (isLoading) return
    setShowModal(false)
    setError(null)
  }

  return (
    <>
      {/* 触发按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-red-700">停用账户</h4>
          <p className="text-sm text-red-600">暂时停用你的账户，可以随时恢复</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors md:w-auto"
        >
          停用账户
        </button>
      </div>

      {/* 停用确认弹窗 - 无遮罩层 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div
            className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* 标题 */}
            <div className="flex items-center gap-2 mb-3 pr-6">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
              <h3 className="text-base font-bold text-gray-900">确认停用账户？</h3>
            </div>

            {/* 说明信息 */}
            <p className="text-sm text-gray-600 mb-3">
              停用账户后：
            </p>
            <ul className="text-sm text-gray-700 mb-4 space-y-1 list-disc list-inside">
              <li>你的文章将对外不可见</li>
              <li>所有数据将被保留</li>
              <li>你将自动退出登录</li>
            </ul>

            {/* 恢复说明 */}
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <p className="text-sm text-blue-700">
                <Power className="w-4 h-4 inline mr-1" />
                重新登录即可自动激活账户
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* 按钮 */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
              >
                取消
              </button>
              <button
                onClick={handleDeactivate}
                disabled={isLoading}
                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg text-sm flex items-center justify-center gap-1"
              >
                <Power className="w-4 h-4" />
                {isLoading ? '停用中...' : '确认停用'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
