'use client'

/**
 * 内容偏好设置区块
 * @module components/settings/content/ContentSection
 * @description 内容偏好设置主组件
 */

import { useState } from 'react'
import { SettingsSection } from '../_layout/SettingsSection'
import { ContentLanguage } from './ContentLanguage'
import { useSettings } from '../_layout/SettingsLayout'

/**
 * 内容偏好设置区块
 * @returns 内容偏好设置组件
 */
export function ContentSection() {
  {/* 从 Context 获取服务端预取的数据，避免重复请求 */}
  const { userSettings } = useSettings()

  {/* 使用服务端获取的初始值 */}
  const [contentLanguage, setContentLanguage] = useState(
    userSettings.content.content_language
  )

  /**
   * 处理语言变更
   */
  const handleLanguageChange = (language: string) => {
    setContentLanguage(language)
  }

  return (
    <SettingsSection id="settings-content-section" title="内容偏好">
      <div className="space-y-8">
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
