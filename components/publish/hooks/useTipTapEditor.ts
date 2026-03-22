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

import { useEditor, type Editor, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { uploadImage, getImageFromPaste } from '@/lib/upload/img'
import { toast } from 'sonner'
import { ImgNodeView } from '../_blocks/ImgNodeView'

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
  const [isUploading, setIsUploading] = useState(false)

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
   * 处理图片上传并插入编辑器
   *
   * @param file - 图片文件
   * @param editorInstance - 编辑器实例
   */
  const handleImageUpload = useCallback(async (file: File, editorInstance: Editor) => {
    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      console.log('Uploaded image URL:', url)

      // 使用 insertContent 插入图片节点，支持自定义属性
      editorInstance.chain().focus().insertContent({
        type: 'image',
        attrs: {
          src: url,
          alt: file.name,
          'data-align': 'center',
        },
      }).run()

      toast.success('图片上传成功')
    } catch (error) {
      const message = error instanceof Error ? error.message : '图片上传失败'
      toast.error(message)
      console.error('Image upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }, [])

  /**
   * 缓存编辑器配置
   * 使用 useMemo 避免每次渲染重新创建配置对象
   * 减少不必要的重渲染
   *
   * 注意：Tiptap 3.0+ 的 StarterKit 已包含 Link 和 Underline 扩展
   * 无需单独导入，避免重复注册
   */
  const editorConfig = useMemo(
    () => ({
      extensions: [
        // StarterKit 内置功能：bold, italic, code, list, undo/redo, link, underline 等
        StarterKit.configure({
          // 显式启用工具栏所需功能（undefined 表示使用默认配置）
          heading: undefined,
          blockquote: undefined,
          horizontalRule: undefined,
          // StarterKit 3.0+ 已包含 link 和 underline
          link: {
            openOnClick: false,
            linkOnPaste: true,
          },
          underline: undefined,
        }),
        // 图片扩展 - 支持对齐属性和自定义 NodeView
        Image.extend({
          addNodeView() {
            return ReactNodeViewRenderer(ImgNodeView)
          },
          addAttributes() {
            return {
              src: {
                default: null,
                parseHTML: element => element.getAttribute('src'),
                renderHTML: attributes => ({
                  src: attributes.src,
                }),
              },
              alt: {
                default: null,
                parseHTML: element => element.getAttribute('alt'),
                renderHTML: attributes => ({
                  alt: attributes.alt,
                }),
              },
              title: {
                default: null,
                parseHTML: element => element.getAttribute('title'),
                renderHTML: attributes => ({
                  title: attributes.title,
                }),
              },
              'data-align': {
                default: 'center',
                parseHTML: element => element.getAttribute('data-align'),
                renderHTML: attributes => ({
                  'data-align': attributes['data-align'],
                }),
              },
            }
          },
        }).configure({
          inline: false,
          allowBase64: false,
        }),
        // 占位符扩展
        Placeholder.configure({
          placeholder,
        }),
      ],
      content,
      editable: true,
      immediatelyRender: false, // 避免 SSR 水合错误
      onUpdate: ({ editor }: { editor: Editor }) => {
        onChange(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class: 'prose prose-lg max-w-none focus:outline-none min-h-[60vh] leading-relaxed',
        },
        /**
         * 处理粘贴事件 - 支持粘贴上传图片
         */
        handlePaste(view: unknown, event: ClipboardEvent) {
          const imageFile = getImageFromPaste(event)
          if (imageFile) {
            event.preventDefault()
            void handleImageUpload(imageFile, (view as { editor: Editor }).editor)
            return true
          }
          return false
        },
        /**
         * 处理拖拽事件 - 支持拖拽上传图片
         */
        handleDrop(view: unknown, event: DragEvent) {
          const files = event.dataTransfer?.files
          if (files && files.length > 0) {
            const file = files[0]
            if (file.type.startsWith('image/')) {
              event.preventDefault()
              void handleImageUpload(file, (view as { editor: Editor }).editor)
              return true
            }
          }
          return false
        },
      },
    }),
    [content, onChange, placeholder, handleImageUpload]
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

  return { editor, isMounted, isUploading, handleImageUpload }
}
