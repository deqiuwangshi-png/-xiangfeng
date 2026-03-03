'use client'

/**
 * 发布页客户端组件
 * 
 * 将动态导入逻辑封装在客户端组件中
 * 解决 Server Component 中不能使用 ssr: false 的问题
 * 
 * @module PublishPageClient
 */

import dynamic from 'next/dynamic'
import { EditorSkeleton } from '@/components/publish/_skeleton/EditorSkeleton'

/**
 * 动态导入编辑器组件
 * 
 * 优化策略：
 * - ssr: false 避免服务端渲染 TipTap（它依赖浏览器 API）
 * - loading 显示骨架屏，优化感知性能
 * - 将 100KB+ 的编辑器代码分割到单独的 chunk
 */
const DynamicEditor = dynamic(
  () => import('@/components/publish/_core/DynamicEditor'),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
)

/**
 * 发布页客户端组件
 * 
 * @returns 发布页JSX
 */
export default function PublishPageClient() {
  return <DynamicEditor />
}
