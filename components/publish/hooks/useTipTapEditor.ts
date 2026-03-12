'use client'

/**
 * TipTap 编辑器 Hook - 优化版
 *
 * 性能优化：
 * - 延迟初始化，避免阻塞主线程
 * - 使用 useMemo 缓存配置
 * - 优化扩展配置，避免重复注册
 *
 * @module useTipTapEditor
 */

import { useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { useEffect, useState, useMemo } from 'react'

/**
 * 编辑器选项接口
 */
interface UseTipTapEditorOptions {
  /** 初始内容 */
  content: string
  /** 内容变化回调 */
  onChange: (content: string) => void
  /** 占位符文本 */
  placeholder?: string
}

/**
 * TipTap 编辑器 Hook
 *
 * 优化特性：
 * - 延迟初始化避免 SSR 水合错误
 * - 使用 useMemo 缓存编辑器配置
 * - 优化扩展配置，只启用必要功能
 * - 避免扩展重复注册
 * - 延迟挂载减少首屏阻塞
 *
 * @param options - 编辑器选项
 * @returns 编辑器实例和挂载状态
 *
 * @example
 * ```typescript
 * const { editor, isMounted } = useTipTapEditor({
 *   content: '<p>Hello</p>',
 *   onChange: (html) => console.log(html),
 *   placeholder: '开始书写...'
 * })
 * ```
 */
export function useTipTapEditor({
  content,
  onChange,
  placeholder = '开始书写你的故事...',
}: UseTipTapEditorOptions) {
  const [isMounted, setIsMounted] = useState(false)

  /**
   * 延迟挂载编辑器
   * 使用 setTimeout 延迟初始化，避免阻塞首屏渲染
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 50) // 50ms 延迟，让首屏先渲染

    return () => clearTimeout(timer)
  }, [])

  /**
   * 缓存编辑器配置
   * 使用 useMemo 避免每次渲染重新创建配置对象
   * 减少不必要的重渲染
   *
   * 注意：StarterKit 不包含 underline 和 link 和 underline
   * 需要单独导入注册
   */
  const editorConfig = useMemo(
    () => ({
      extensions: [
        // StarterKit 内置功能：bold, italic, code, list, undo/redo 等
        StarterKit.configure({
          // 显式启用工具栏所需功能（undefined 表示使用默认配置）
          heading: undefined,
          blockquote: undefined,
          horizontalRule: undefined,
        }),
        // 占位符扩展
        Placeholder.configure({
          placeholder,
        }),
        // 下划线扩展（StarterKit 不包含）
        Underline,
        // 链接扩展（StarterKit 不包含）
        Link.configure({
          openOnClick: false,
          linkOnPaste: true,
        })
      ],
      content,
      editable: true,
      immediatelyRender: false, // 避免 SSR 水合错误
      onUpdate: ({ editor }: { editor: Editor }) => {
        onChange(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class: 'prose prose-lg max-w-none focus:outline-none min-h-[60vh]',
        },
      },
    }),
    [content, onChange, placeholder]
  )

  // 创建编辑器实例
  const editor = useEditor(editorConfig, [isMounted])

  /**
   * 同步外部内容变化
   * 当外部 content 变化时更新编辑器内容
   */
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return { editor, isMounted }
}
