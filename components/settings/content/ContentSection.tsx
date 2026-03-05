'use client'

/**
 * 内容偏好设置区块
 * @module components/settings/content/ContentSection
 * @description 内容偏好设置主组件
 */

import { useState, useEffect } from 'react'
import { SettingsSection } from '../_layout/SettingsSection'
import { ContentLanguage } from './ContentLanguage'
import { getContentSettings } from '@/lib/settings/actions'

/**
 * 内容偏好设置区块
 * @returns 内容偏好设置组件
 */
export function ContentSection() {
  const [contentLanguage, setContentLanguage] = useState('zh-CN')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * 加载用户内容设置
   */
  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getContentSettings()

        if (result.success && result.content_language) {
          setContentLanguage(result.content_language)
        } else if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        console.error('加载内容设置失败:', err)
        setError('加载设置失败')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  /**
   * 处理语言变更
   */
  const handleLanguageChange = (language: string) => {
    setContentLanguage(language)
  }

  if (isLoading) {
    return (
      <SettingsSection id="settings-content-section" title="内容偏好">
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SettingsSection>
    )
  }

  return (
    <SettingsSection id="settings-content-section" title="内容偏好">
      <div className="space-y-8">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <ContentLanguage
          currentLanguage={contentLanguage}
          onChange={handleLanguageChange}
        />

        {/* 预留：其他内容偏好设置项 */}
        {/* 如：内容过滤、推荐算法偏好等 */}
      </div>
    </SettingsSection>
  )
}
