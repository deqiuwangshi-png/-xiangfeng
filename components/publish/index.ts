/**
 * 发布页面组件索引 - JSON 版本
 *
 * 作用: 统一导出发布页面的所有组件
 * 性能优化说明:
 *   - DynamicEditor 使用动态导入，减少首屏加载时间
 *   - EditorSkeleton 提供加载状态，优化感知性能
 *   - SaveStatus 提供保存状态指示
 *
 * 更新时间: 2025-04-05 (JSON 改造)
 */

export { EditorHeader } from './_header/EditorHeader'
export { EditorCard } from './_core/EditorCard'
export { TitleInput } from './_inputs/TitleInput'
export { CharacterCounter } from './_core/CharacterCounter'
export { EditorToolbar } from './_toolbar/EditorToolbar'
export { ToolbarButton } from './_toolbar/ToolbarButton'
export { EditorSkeleton } from './_skeleton/EditorSkeleton'
export { SaveStatus } from './_core/SaveStatus'
// DynamicEditor 默认导出，用于动态导入
export { default as DynamicEditor } from './_core/DynamicEditor'
// 发布页面客户端组件
export { default as PublishPageClient } from './PublishPageClient'
