/**
 * 发布页面组件索引
 *
 * 作用: 统一导出发布页面的所有组件
 *
 * 使用说明:
 *   从此文件导入发布页面的所有组件
 *   示例: import { EditorHeader, EditorCard, EditorToolbar } from '@/components/publish'
 *
 * 性能优化说明:
 *   - DynamicEditor 使用动态导入，减少首屏加载时间
 *   - EditorSkeleton 提供加载状态，优化感知性能
 *
 * 更新时间: 2026-03-03
 */

export { EditorHeader } from './EditorHeader'
export { EditorCard } from './EditorCard'
export { TitleInput } from './TitleInput'
export { CharacterCounter } from './CharacterCounter'
export { EditorToolbar } from './EditorToolbar'
export { ToolbarButton } from './ToolbarButton'
export { EditorSkeleton } from './EditorSkeleton'
// DynamicEditor 默认导出，用于动态导入
export { default as DynamicEditor } from './DynamicEditor'
