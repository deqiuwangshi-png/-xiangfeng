'use client'

import { useState, useEffect } from 'react'
import { X } from '@/components/icons'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { getLoginHistory } from '@/lib/auth/server'
import { formatDateTime } from '@/lib/utils/date'
import type { LoginHistoryItem } from '@/types'

/**
 * 登录历史弹窗组件属性
 * @interface LoginHistoryDialogProps
 */
interface LoginHistoryDialogProps {
  /** 是否显示 */
  isOpen: boolean
  /** 关闭回调 */
  onClose: () => void
}

/**
 * 获取设备图标
 * @param deviceType - 设备类型
 * @returns 图标组件
 */
function getDeviceIcon(deviceType: string | null) {
  if (deviceType === 'mobile') return Smartphone
  if (deviceType === 'tablet') return Tablet
  return Monitor
}

/**
 * 登录历史弹窗组件
 *
 * @param {LoginHistoryDialogProps} props - 组件属性
 * @returns {JSX.Element | null} 登录历史弹窗
 */
export function LoginHistoryDialog({ isOpen, onClose }: LoginHistoryDialogProps) {
  const [history, setHistory] = useState<LoginHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 加载登录历史
   */
  const loadHistory = async () => {
    setIsLoading(true)
    setError(null)

    const result = await getLoginHistory()

    if (result.success && result.data) {
      setHistory(result.data)
    } else {
      setError(result.error || '获取失败')
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (!isOpen) return

    // 使用 setTimeout 避免在 effect 中同步调用 setState
    const timer = setTimeout(() => {
      loadHistory()
    }, 0)

    return () => clearTimeout(timer)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] shadow-2xl border border-gray-200 relative pointer-events-auto flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">登录历史</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无登录记录</div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const DeviceIcon = getDeviceIcon(item.device_type)
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600">
                      <DeviceIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {item.browser || '未知浏览器'}
                        </span>
                        {item.is_new_device && (
                          <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded">
                            新设备
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.os || '未知系统'} · {item.ip_address || '未知IP'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(item.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="p-4 border-t text-center text-xs text-gray-400">
          只显示最近 20 条登录记录
        </div>
      </div>
    </div>
  )
}
