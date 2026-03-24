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
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import Paragraph from '@tiptap/extension-paragraph'
import type { EditorView } from '@tiptap/pm/view'
import type { Slice } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { useEffect, useLayoutEffect, useState, useMemo, useRef, useCallback } from 'react'
import { uploadImage, getImageFromPaste } from '@/lib/upload/img'
import { toast } from 'sonner'
import { ImgNodeView } from '../_blocks/ImgNodeView'
import { ParaNodeView } from '../_blocks/ParaNodeView'

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
   * 使用 ref 存储上传状态，避免闭包问题
   */
  const isUploadingRef = useRef(false)
  isUploadingRef.current = isUploading

  /**
   * 客户端环境初始化编辑器
   * 使用 useLayoutEffect 确保与 React 渲染同步
   * 避免使用 setTimeout，减少初始化延迟
   */
  useLayoutEffect(() => {
    // 确保在客户端环境初始化
    if (typeof window !== 'undefined') {
      setIsMounted(true)
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
        // 段落使用自定义 NodeView 支持拖拽
        StarterKit.configure({
          // 显式启用工具栏所需功能（undefined 表示使用默认配置）
          paragraph: false, // 禁用默认段落，使用自定义 NodeView
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
        // 自定义段落扩展 - 支持拖拽排序
        Paragraph.extend({
          addNodeView() {
            return ReactNodeViewRenderer(ParaNodeView)
          },
        }),
        // 表格扩展 - 最简配置，禁用复杂功能
        Table.configure({
          resizable: false, // 禁用列宽调整
          HTMLAttributes: {
            class: 'simple-table',
          },
        }),
        TableRow,
        TableHeader.configure({
          HTMLAttributes: {
            class: 'simple-table-header',
          },
        }),
        TableCell.configure({
          HTMLAttributes: {
            class: 'simple-table-cell',
          },
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
          // 只在可编辑状态下显示占位符
          showOnlyWhenEditable: true,
          // 只在当前选中的节点显示占位符
          showOnlyCurrent: true,
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
        handlePaste(_view: unknown, event: ClipboardEvent) {
          const imageFile = getImageFromPaste(event)
          if (imageFile) {
            event.preventDefault()
            void handleImageUploadRef.current(imageFile)
            return true
          }
          return false
        },
        /**
         * 处理拖拽事件 - 支持拖拽上传图片和节点排序
         * 简化逻辑：每一行是一个独立区块，只交换上下位置
         */
        handleDrop(view: EditorView, event: DragEvent, _slice: Slice, moved: boolean) {
          // 处理文件拖拽上传
          const files = event.dataTransfer?.files
          if (files && files.length > 0) {
            const file = files[0]
            if (file.type.startsWith('image/')) {
              event.preventDefault()
              void handleImageUploadRef.current(file)
              return true
            }
          }

          // 处理节点拖拽排序（行级交换）
          const dragPos = event.dataTransfer?.getData('application/x-prosemirror-node')
          if (dragPos && !moved) {
            const from = Number(dragPos)
            const { state } = view

            // 验证位置有效性
            if (from < 0 || from >= state.doc.content.size) {
              return false
            }

            // 获取拖拽的段落节点
            const $from = state.doc.resolve(from)
            const fromStart = $from.before($from.depth)
            const fromEnd = $from.after($from.depth)
            const draggedNode = state.doc.nodeAt(fromStart)

            if (!draggedNode || draggedNode.type.name !== 'paragraph') {
              return false
            }

            // 获取放置位置（找到最近的段落边界）
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })

            if (!coordinates) {
              return false
            }

            const $to = state.doc.resolve(coordinates.pos)
            let toStart = $to.before($to.depth)

            // 确保放置位置与起始位置不同
            if (toStart === fromStart) {
              return false
            }

            // 调整放置位置（如果向后移动，需要考虑删除后的位置变化）
            if (toStart > fromStart) {
              toStart -= draggedNode.nodeSize
            }

            // 确保位置有效
            toStart = Math.max(0, Math.min(toStart, state.doc.content.size - draggedNode.nodeSize))

            event.preventDefault()

            // 创建事务：交换两个段落的位置
            const tr = state.tr

            // 删除原段落
            tr.delete(fromStart, fromEnd)
            // 在新位置插入段落
            tr.insert(toStart, draggedNode)
            // 设置选区到新位置
            tr.setSelection(TextSelection.create(tr.doc, toStart + 1))

            // 直接 dispatch 事务，避免 setTimeout 延迟
            view.dispatch(tr)
            return true
          }

          return false
        },
      },
    }),
    [content, onChange, placeholder]
  )

  // 创建编辑器实例
  const editor = useEditor(editorConfig, [isMounted])

  /**
   * 处理图片上传并插入编辑器
   * 使用 useRef 存储 editor 实例，避免闭包问题
   */
  const editorRef = useRef<Editor | null>(null)
  
  // 确保 editorRef 始终更新到最新的 editor 实例
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * 处理图片上传
   * 通过 ref 获取最新的 editor 实例，避免闭包陷阱
   */
  const handleImageUpload = useCallback(async (file: File) => {
    const currentEditor = editorRef.current
    if (!currentEditor) {
      toast.error('编辑器未就绪')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      console.log('Uploaded image URL:', url)

      // 使用 insertContent 插入图片节点，支持自定义属性
      currentEditor.chain().focus().insertContent({
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
   * 创建 handleImageUpload ref，用于在 editorConfig 中引用
   */
  const handleImageUploadRef = useRef<(file: File) => Promise<void>>(handleImageUpload)
  
  // 确保 handleImageUploadRef 始终更新到最新的 handleImageUpload 函数
  useEffect(() => {
    handleImageUploadRef.current = handleImageUpload
  }, [handleImageUpload])

  /**
   * 同步外部内容变化
   * 当外部 content 变化时更新编辑器内容
   * 优化：避免在用户编辑过程中强制同步
   */
  useEffect(() => {
    if (editor) {
      // 检查编辑器是否就绪且内容确实不同
      try {
        const currentContent = editor.getHTML()
        // 只有当内容确实不同时才更新，避免不必要的操作
        if (currentContent !== content && content) {
          // 直接设置内容，避免不必要的操作
          editor.commands.setContent(content)
        }
      } catch (error) {
        console.error('Error syncing content:', error)
      }
    }
  }, [editor, content])

  return { editor, isMounted, isUploading, handleImageUpload }
}
