'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { ColorPreview } from '../_ui/ColorPreview'
import { useState, useEffect, useCallback } from 'react'
import { PRESET_THEME_BACKGROUNDS, THEME_MODES } from '@/types/user/settings'
import { updateAppearanceSettings } from '@/lib/settings/actions/appearance'
import { useSettings } from '../_layout/SettingsLayout'
import { toast } from 'sonner'

/**
 * 外观与主题设置区块（Client Component）
 *
 * 作用: 显示外观与主题设置相关选项，支持主题持久化
 *
 * @returns {JSX.Element} 外观与主题设置区块
 *
 * 性能优化:
 *   - 从 Context 获取服务端预取的数据，避免重复请求
 *   - 使用 localStorage 缓存主题设置，减少服务端请求
 *   - 实时应用主题，无需刷新页面
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据持久化
 *   - 数据通过 Context 从 Server Component 传递
 *   - 支持实时主题切换
 * 更新时间: 2026-03-28
 */

/**
 * 应用主题到文档
 * @param theme - 主题模式 ('light' | 'dark' | 'auto')
 */
function applyTheme(theme: string) {
  const root = document.documentElement
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  let effectiveTheme = theme
  if (theme === 'auto') {
    effectiveTheme = systemPrefersDark ? 'dark' : 'light'
  }

  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  // 保存到 localStorage 用于快速恢复
  localStorage.setItem('theme', theme)
}

/**
 * 应用主题背景
 * @param background - 主题背景值
 */
function applyThemeBackground(background: string) {
  const root = document.documentElement
  root.style.setProperty('--theme-background', background)
  localStorage.setItem('theme-background', background)
}

export function AppearanceSection() {
  const { userSettings } = useSettings()

  // 使用服务端预取的数据初始化，避免 hydration 错误
  // 同时与 localStorage 同步，确保用户体验一致性
  const [selectedTheme, setSelectedTheme] = useState(userSettings.appearance.theme)
  const [selectedBackground, setSelectedBackground] = useState(userSettings.appearance.theme_background)
  const [isSaving, setIsSaving] = useState(false)

  // 组件挂载时应用主题（服务端数据已初始化，这里主要是应用样式）
  useEffect(() => {
    // 从 localStorage 读取保存的主题设置（优先于服务端数据）
    const savedTheme = localStorage.getItem('theme')
    const savedBackground = localStorage.getItem('theme-background')

    // 如果有本地缓存，使用本地缓存；否则使用服务端数据
    const effectiveTheme = savedTheme || userSettings.appearance.theme
    const effectiveBackground = savedBackground || userSettings.appearance.theme_background

    setSelectedTheme(effectiveTheme)
    setSelectedBackground(effectiveBackground)

    applyTheme(effectiveTheme)
    applyThemeBackground(effectiveBackground)
  }, [userSettings.appearance.theme, userSettings.appearance.theme_background])

  /**
   * 处理主题切换
   * @param theme - 新主题
   */
  const handleThemeChange = useCallback(async (theme: string) => {
    setSelectedTheme(theme)
    applyTheme(theme)

    // 保存到服务端
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('key', 'theme')
      formData.append('value', theme)

      const result = await updateAppearanceSettings(formData)
      if (!result.success) {
        toast.error('主题保存失败: ' + (result.error || '未知错误'))
      }
    } catch {
      toast.error('主题保存失败，请稍后重试')
    } finally {
      setIsSaving(false)
    }
  }, [])

  /**
   * 处理背景切换
   * @param background - 新背景
   */
  const handleBackgroundChange = useCallback(async (background: string) => {
    setSelectedBackground(background)
    applyThemeBackground(background)

    // 保存到服务端
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('key', 'theme_background')
      formData.append('value', background)

      const result = await updateAppearanceSettings(formData)
      if (!result.success) {
        toast.error('背景保存失败: ' + (result.error || '未知错误'))
      }
    } catch {
      toast.error('背景保存失败，请稍后重试')
    } finally {
      setIsSaving(false)
    }
  }, [])

  return (
    <SettingsSection id="settings-appearance-section" title="外观与主题">
      <div className="space-y-8">
        <SettingItem
          label="主题模式"
          description={isSaving ? '保存中...' : '选择界面外观'}
          control={
            <div className="flex gap-4">
              {THEME_MODES.map((mode) => (
                <div key={mode.value} className="flex flex-col items-center">
                  <ColorPreview
                    color={mode.previewColor}
                    isActive={selectedTheme === mode.value}
                    onClick={() => handleThemeChange(mode.value)}
                  />
                  <span className="text-xs mt-2 text-xf-dark">{mode.label}</span>
                </div>
              ))}
            </div>
          }
        />

        <SettingItem
          label="主题背景"
          description="选择界面背景风格"
          control={
            <div className="flex flex-wrap gap-3">
              {PRESET_THEME_BACKGROUNDS.map((bg) => (
                <div key={bg.value} className="flex flex-col items-center">
                  <ColorPreview
                    color={bg.previewColor}
                    isActive={selectedBackground === bg.value}
                    onClick={() => handleBackgroundChange(bg.value)}
                  />
                  <span className="text-xs mt-2 text-xf-dark">{bg.label}</span>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </SettingsSection>
  )
}
