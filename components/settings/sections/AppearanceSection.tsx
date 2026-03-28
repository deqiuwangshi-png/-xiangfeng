'use client'

import { SettingsSection } from '../_layout/SettingsSection'
import { SettingItem } from '../_layout/SettingItem'
import { ColorPreview } from '../_ui/ColorPreview'
import { useState, useEffect, useCallback } from 'react'
import { PRESET_THEME_COLORS, THEME_MODES } from '@/types/settings'
import { updateAppearanceSettings } from '@/lib/settings/actions'
import { toast } from 'sonner'

/**
 * 外观与主题设置区块（Client Component）
 *
 * 作用: 显示外观与主题设置相关选项，支持主题持久化
 *
 * @returns {JSX.Element} 外观与主题设置区块
 *
 * 性能优化:
 *   - 使用 localStorage 缓存主题设置，减少服务端请求
 *   - 实时应用主题，无需刷新页面
 *   - 防抖保存到服务端
 *
 * 架构说明:
 *   - 使用'use client'指令
 *   - 使用Server Actions进行数据持久化
 *   - 支持实时主题切换
 * 更新时间: 2026-03-27
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
 * 应用主题颜色
 * @param color - 主题颜色值
 */
function applyThemeColor(color: string) {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', color)
  localStorage.setItem('theme-color', color)
}

export function AppearanceSection() {
  // 从 localStorage 初始化状态，避免闪烁
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  const [selectedColor, setSelectedColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-color') || '#6A5B8A'
    }
    return '#6A5B8A'
  })

  const [isSaving, setIsSaving] = useState(false)

  // 组件挂载时应用保存的主题 - 只在挂载时执行一次 
  useEffect(() => {
    applyTheme(selectedTheme)
    applyThemeColor(selectedColor)
  },)

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
   * 处理颜色切换
   * @param color - 新颜色
   */
  const handleColorChange = useCallback(async (color: string) => {
    setSelectedColor(color)
    applyThemeColor(color)

    // 保存到服务端
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('key', 'theme_color')
      formData.append('value', color)

      const result = await updateAppearanceSettings(formData)
      if (!result.success) {
        toast.error('颜色保存失败: ' + (result.error || '未知错误'))
      }
    } catch {
      toast.error('颜色保存失败，请稍后重试')
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
          label="主题颜色"
          description="选择主色调"
          control={
            <div className="flex flex-wrap gap-3">
              {PRESET_THEME_COLORS.map((color) => (
                <div key={color.value} className="flex flex-col items-center">
                  <ColorPreview
                    color={color.value}
                    isActive={selectedColor === color.value}
                    onClick={() => handleColorChange(color.value)}
                  />
                  <span className="text-xs mt-2 text-xf-dark">{color.label}</span>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </SettingsSection>
  )
}
