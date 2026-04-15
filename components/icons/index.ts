/**
 * 图标库统一出口
 * @module components/icons
 * @description 全站图标统一管理和导出
 *
 * 使用方式：
 * import { Trash2, X, Loader2 } from '@/components/icons'
 *
 * 分模块导出：
 * - common: 高频通用图标
 * - editor: 编辑器专用图标
 * - navigation: 导航图标
 * - article: 文章页图标
 * - settings: 设置页图标
 * - profile: 个人中心图标
 * - rewards: 福利中心图标
 */

export * from './common'
export * from './editor'
export * from './navigation'
export * from './article'
export * from './settings'
export * from './profile'
export * from './Logo'

export type { LucideIcon } from 'lucide-react'
