'use client'

/**
 * 内容语言选择组件
 * @module components/settings/content/ContentLanguage
 * @description 内容语言偏好设置
 */

import { useState, useCallback } from 'react'
import { SettingItem } from '../_layout/SettingItem'
import { updateContentLanguage } from '@/lib/settings/actions/content'
import { SUPPORTED_LANGUAGES } from '@/types/settings'

/**
 * 内容语言选择组件属性
 */
interface ContentLanguageProps {
  /** 当前语言 */
  currentLanguage: string
  /** 语言变更回调 */
  onChange: (language: string) => void
}

/**
 * 内容语言选择组件
 * @param props 组件属性
 * @returns 语言选择器
 */
export function ContentLanguage({ currentLanguage, onChange }: ContentLanguageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 处理语言变更
   */
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLanguage = e.target.value
      setError(null)
      setIsLoading(true)

      try {
        const result = await updateContentLanguage(newLanguage)

        if (result.success) {
          onChange(newLanguage)
        } else {
          setError(result.error || '保存失败')
        }
      } catch {
        setError('保存失败，请稍后重试')
      } finally {
        setIsLoading(false)
      }
    },
    [onChange]
  )

  return (
    <div>
      <SettingItem
        label="内容语言"
        description="优先显示指定语言的内容"
        controlType="select"
        control={
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border border-xf-bg/60 focus:border-xf-primary outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            {isLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                保存中...
              </span>
            )}
          </div>
        }
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
