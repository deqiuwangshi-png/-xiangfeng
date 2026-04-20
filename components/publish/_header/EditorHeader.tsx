'use client'

import { Save, Send, Loader2, Maximize, Minimize } from '@/components/icons'
import { cn } from '@/lib/utils/utils'
import type { SaveStatus as SaveStatusType } from '@/types/publish/editor'
import { Check, AlertCircle } from 'lucide-react'

interface EditorHeaderProps {
  onSaveDraft: () => void
  onPublish: () => void
  isSaving?: boolean
  isPublishing?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  className?: string
  saveStatus?: SaveStatusType
  lastSavedAt?: Date | null
  errorMessage?: string | null
}

export function EditorHeader({
  onSaveDraft,
  onPublish,
  isSaving = false,
  isPublishing = false,
  isFullscreen = false,
  onToggleFullscreen,
  className,
  saveStatus = 'idle',
  lastSavedAt = null,
  errorMessage = null,
}: EditorHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shrink-0", className)}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onSaveDraft}
              disabled={isSaving || isPublishing}
              className="text-sm text-xf-medium hover:text-xf-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-xf-bg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={isSaving ? '保存中...' : '保存文章'}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>

            <div className="hidden sm:block">
              <SaveStatusChip
                status={saveStatus}
                lastSavedAt={lastSavedAt}
                errorMessage={errorMessage}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 专注模式切换按钮 */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="text-sm text-xf-medium hover:text-xf-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-xf-bg flex items-center gap-2"
                title={isFullscreen ? '退出专注模式' : '进入专注模式'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{isFullscreen ? '退出专注' : '专注模式'}</span>
              </button>
            )}

            <button
              onClick={onPublish}
              disabled={isSaving || isPublishing}
              className="bg-xf-primary text-white border-none rounded-xl px-6 py-2 font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isPublishing ? '发布中...' : '发布'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function SaveStatusChip({
  status,
  lastSavedAt,
  errorMessage,
}: {
  status: SaveStatusType
  lastSavedAt: Date | null
  errorMessage?: string | null
}) {
  // 方案A：保存中状态只由保存按钮承担，避免双重反馈
  if (status === 'saving') {
    return null
  }

  if ((status === 'idle' || status === 'saved') && !lastSavedAt) {
    return null
  }

  const savedConfig = {
    icon: Check,
    className: 'text-green-600 bg-green-50',
    show: !!lastSavedAt,
  } as const

  const config = {
    idle: {
      ...savedConfig,
    },
    saving: {
      icon: Check,
      className: 'text-green-600 bg-green-50',
      show: false,
    },
    saved: {
      ...savedConfig,
    },
    error: {
      icon: AlertCircle,
      className: 'text-red-600 bg-red-50',
      show: true,
    },
  } as const

  const current = config[status]
  if (!current.show) {
    return null
  }

  const Icon = current.icon
  return (
    <div
      className={`
        flex items-center justify-center w-7 h-7 rounded-full
        transition-all duration-300 ease-in-out
        ${current.className}
      `}
      role="status"
      aria-live="polite"
      title={status === 'error' ? (errorMessage || '保存失败') : undefined}
    >
      <Icon className="w-3.5 h-3.5" />
    </div>
  )
}
