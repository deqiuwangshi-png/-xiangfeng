'use client'

/**
 * 保存状态指示器组件
 * @module SaveStatus
 * @description 显示编辑器自动保存状态：保存中、已保存、保存失败
 */

import { Save, Check, AlertCircle } from 'lucide-react'
import type { SaveStatus } from '@/hooks/publish/useAutoSave'

interface SaveStatusProps {
  status: SaveStatus
  lastSavedAt: Date | null
  errorMessage?: string | null
}

/**
 * 格式化保存时间
 * @param date - 保存时间
 * @returns 格式化字符串
 */
function formatSavedTime(date: Date | null): string {
  if (!date) return ''
  
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于 1 分钟
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 小于 1 小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 大于 1 小时
  const hours = Math.floor(diff / 3600000)
  return `${hours}小时前`
}

/**
 * 保存状态指示器
 */
export function SaveStatus({ status, lastSavedAt, errorMessage }: SaveStatusProps) {
  // 空闲状态不显示
  if (status === 'idle' && !lastSavedAt) {
    return null
  }

  const config = {
    idle: {
      icon: Check,
      text: lastSavedAt ? `已保存 ${formatSavedTime(lastSavedAt)}` : '',
      className: 'text-green-600 bg-green-50',
      show: !!lastSavedAt,
    },
    saving: {
      icon: Save,
      text: '保存中...',
      className: 'text-blue-600 bg-blue-50 animate-pulse',
      show: true,
    },
    saved: {
      icon: Check,
      text: `已保存 ${formatSavedTime(lastSavedAt)}`,
      className: 'text-green-600 bg-green-50',
      show: true,
    },
    error: {
      icon: AlertCircle,
      text: errorMessage || '保存失败',
      className: 'text-red-600 bg-red-50',
      show: true,
    },
  }

  const current = config[status]
  const Icon = current.icon

  if (!current.show) {
    return null
  }

  return (
    <div
      className={`
        flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        transition-all duration-300 ease-in-out
        ${current.className}
      `}
      role="status"
      aria-live="polite"
    >
      <Icon className={`w-3.5 h-3.5 ${status === 'saving' ? 'animate-spin' : ''}`} />
      <span>{current.text}</span>
    </div>
  )
}
