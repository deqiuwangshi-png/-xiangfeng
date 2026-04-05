'use client'

/**
 * TipTap 编辑器 Hook - JSON 版本
 * @module useTipTapEditor
 * @description 使用 JSON 格式存储内容，支持图片即时反馈
 */

import { useEditor, type Editor, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'

import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import type { EditorView } from '@tiptap/pm/view'
import type { Slice } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { useEffect, useLayoutEffect, useState, useMemo, useRef, useCallback } from 'react'
import {
  uploadEditorImage,
  createBlobUrl,
  revokeBlobUrl,
  getImageFromPaste,
} from '@/lib/upload/editorImage'
import { toast } from 'sonner'
import { ImgNodeView } from '@/components/publish/_blocks/ImgNodeView'
import { ParaNodeView } from '@/components/publish/_blocks/ParaNodeView'
import type { TipTapJSON, TipTapNode } from '@/lib/utils/json'

// 重新导出类型以便向后兼容
export type { TipTapJSON, TipTapNode }

/**
 * 编辑器选项接口
 */
interface UseTipTapEditorOptions {
  /** 初始内容 (JSON 字符串) */
  content: string
  /** 内容变化回调 (返回 JSON 字符串) */
  onChange: (content: string) => void
  /** 占位符文本 */
  placeholder?: string
}

/**
 * 默认空文档
 */
const EMPTY_DOCUMENT: TipTapJSON = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

/**
 * 解析 JSON 内容
 * @param content - JSON 字符串
 * @returns 解析后的 JSON 对象
 */
function parseContent(content: string): TipTapJSON {
  if (!content) return EMPTY_DOCUMENT
  try {
    const parsed = JSON.parse(content) as TipTapJSON
    if (parsed.type === 'doc') {
      return parsed
    }
    return EMPTY_DOCUMENT
  } catch {
    return EMPTY_DOCUMENT
  }
}

/**
 * TipTap 编辑器 Hook
 *
 * @param options - 编辑器选项
 * @returns 编辑器实例和挂载状态
 */
export function useTipTapEditor({
  content,
  onChange,
  placeholder = '开始书写你的故事...',
}: UseTipTapEditorOptions) {
  const [isMounted, setIsMounted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  /**
   * 追踪上传中的图片
   * key: blobUrl, value: 是否正在上传
   */
  const pendingUploadsRef = useRef<Map<string, boolean>>(new Map())

  /**
   * 防抖定时器引用
   * @性能优化 使用防抖避免每次输入都触发状态更新
   */
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingContentRef = useRef<string>(content)

  /**
   * 防抖处理的内容更新函数
   * @性能优化 延迟 300ms 触发 onChange，减少重渲染
   */
  const debouncedOnChange = useCallback(
    (jsonContent: TipTapJSON) => {
      const jsonString = JSON.stringify(jsonContent)
      pendingContentRef.current = jsonString
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(jsonString)
      }, 300)
    },
    [onChange]
  )

  /**
   * 清理防抖定时器
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  /**
   * 客户端环境初始化编辑器
   * 使用 useLayoutEffect 确保与 React 渲染同步
   * 避免使用 setTimeout，减少初始化延迟
   */
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  /**
   * 清理组件卸载时的 Blob URL
   */
  useEffect(() => {
    const uploadsMap = pendingUploadsRef.current
    return () => {
      // 清理所有未完成的 Blob URL
      uploadsMap.forEach((_, blobUrl) => {
        revokeBlobUrl(blobUrl)
      })
      uploadsMap.clear()
    }
  }, [])

  /**
   * 解析初始内容
   */
  const initialContent = useMemo(() => parseContent(content), [content])

  /**
   * 缓存编辑器配置
   * 使用 useMemo 避免每次渲染重新创建配置对象
   * 减少不必要的重渲染
   */
  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          paragraph: false,
          blockquote: false,
          horizontalRule: {
            HTMLAttributes: {
              class: 'editor-hr',
            },
          },
          link: {
            openOnClick: false,
            linkOnPaste: true,
          },
        }),

        Paragraph.extend({
          addNodeView() {
            return ReactNodeViewRenderer(ParaNodeView)
          },
        }),
        Image.extend({
          addNodeView() {
            return ReactNodeViewRenderer(ImgNodeView)
          },
          addAttributes() {
            return {
              'data-align': {
                default: 'center',
                parseHTML: element => element.getAttribute('data-align'),
                renderHTML: attributes => ({
                  'data-align': attributes['data-align'],
                }),
              },
              'data-uploading': {
                default: null,
                parseHTML: element => element.getAttribute('data-uploading'),
                renderHTML: attributes => ({
                  'data-uploading': attributes['data-uploading'],
                }),
              },
            }
          },
        }).configure({
          inline: false,
          allowBase64: false,
        }),
        Placeholder.configure({
          placeholder,
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
        }),
        TextStyle,
        Color.configure({
          types: ['textStyle'],
        }),
      ],
      content: initialContent,
      editable: true,
      immediatelyRender: false,
      onUpdate: ({ editor }: { editor: Editor }) => {
        debouncedOnChange(editor.getJSON() as TipTapJSON)
      },
      editorProps: {
        attributes: {
          class: 'article-content article-content-editor max-w-none focus:outline-none',
        },
        /**
         * 处理粘贴事件 - 支持粘贴上传图片（即时反馈版）
         */
        handlePaste(_view: unknown, event: ClipboardEvent): boolean {
          // 安全校验：确保事件对象有效
          if (!event?.clipboardData) return false

          const imageFile = getImageFromPaste(event)
          if (imageFile instanceof File) {
            event.preventDefault()
            void handleImageUploadRef.current(imageFile)
            return true
          }
          return false
        },
        /**
         * 处理拖拽事件 - 支持拖拽上传图片
         */
        handleDrop(view: EditorView, event: DragEvent, _slice: Slice, moved: boolean) {
          const files = event.dataTransfer?.files
          if (files && files.length > 0) {
            const file = files[0]
            if (file.type.startsWith('image/')) {
              event.preventDefault()
              void handleImageUploadRef.current(file)
              return true
            }
          }

          // 处理节点拖拽排序
          const dragPos = event.dataTransfer?.getData('application/x-prosemirror-node')
          if (dragPos && !moved) {
            const from = Number(dragPos)
            const { state } = view

            if (from < 0 || from >= state.doc.content.size) {
              return false
            }

            const $from = state.doc.resolve(from)
            const fromStart = $from.before($from.depth)
            const fromEnd = $from.after($from.depth)
            const draggedNode = state.doc.nodeAt(fromStart)

            if (!draggedNode || draggedNode.type.name !== 'paragraph') {
              return false
            }

            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })

            if (!coordinates) {
              return false
            }

            const $to = state.doc.resolve(coordinates.pos)
            let toStart = $to.before($to.depth)

            if (toStart === fromStart) {
              return false
            }

            if (toStart > fromStart) {
              toStart -= draggedNode.nodeSize
            }

            toStart = Math.max(0, Math.min(toStart, state.doc.content.size - draggedNode.nodeSize))

            event.preventDefault()

            const tr = state.tr
            tr.delete(fromStart, fromEnd)
            tr.insert(toStart, draggedNode)
            tr.setSelection(TextSelection.create(tr.doc, toStart + 1))
            view.dispatch(tr)
            return true
          }

          return false
        },
      },
    }),
    [initialContent, debouncedOnChange, placeholder]
  )

  // 创建编辑器实例
  const editor = useEditor(editorConfig, [isMounted])

  const flushPendingContent = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    onChange(pendingContentRef.current)
  }, [onChange])

  // 确保 editorRef 始终更新到最新的 editor 实例
  const editorRef = useRef<Editor | null>(null)
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * 替换编辑器中的 Blob URL 为真实 URL
   */
  const replaceBlobUrlInEditor = useCallback(
    (blobUrl: string, finalUrl: string) => {
      const currentEditor = editorRef.current
      if (!currentEditor) return

      const { state } = currentEditor
      const tr = state.tr
      let replaced = false

      // 遍历文档查找 Blob URL 并替换
      state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.src === blobUrl) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: finalUrl,
            'data-uploading': null,
          })
          replaced = true
        }
      })

      if (replaced) {
        currentEditor.view.dispatch(tr)
      }
    },
    []
  )

  /**
   * 处理图片上传 - 即时反馈版本
   * 1. 立即插入 Blob URL 预览
   * 2. 后台上传
   * 3. 上传成功后替换为真实 URL
   */
  // 使用 ref 保持最新回调引用，避免 editorConfig 重新创建
  const handleImageUploadRef = useRef<(file: File) => Promise<void>>(async () => {})

  const handleImageUpload = useCallback(
    async (file: File) => {
      const currentEditor = editorRef.current
      if (!currentEditor) {
        toast.error('编辑器未就绪')
        return
      }

      // 创建 Blob URL 用于即时预览
      const blobUrl = createBlobUrl(file)

      // 标记为上传中
      pendingUploadsRef.current.set(blobUrl, true)

      // 立即插入 Blob 预览图到编辑器
      currentEditor.chain().focus().insertContent({
        type: 'image',
        attrs: {
          src: blobUrl,
          alt: file.name,
          'data-align': 'center',
          'data-uploading': 'true',
        },
      }).run()

      setIsUploading(true)

      try {
        // 后台上传图片
        const result = await uploadEditorImage(file, blobUrl)

        // 上传成功，替换 Blob URL 为真实 URL
        replaceBlobUrlInEditor(blobUrl, result.url)

        // 释放 Blob URL
        revokeBlobUrl(blobUrl)
        pendingUploadsRef.current.delete(blobUrl)

        toast.success('图片上传成功')
      } catch (error) {
        const message = error instanceof Error ? error.message : '图片上传失败'
        toast.error(message)
        console.error('Image upload error:', error)

        // 上传失败，保留 Blob 图但标记为错误状态
        pendingUploadsRef.current.delete(blobUrl)
        revokeBlobUrl(blobUrl)
      } finally {
        setIsUploading(false)
      }
    },
    [replaceBlobUrlInEditor]
  )

  // 同步更新 ref
  handleImageUploadRef.current = handleImageUpload

  /**
   * 同步外部内容变化
   */
  useEffect(() => {
    if (editor) {
      try {
        const currentContent = JSON.stringify(editor.getJSON())
        if (currentContent !== content) {
          pendingContentRef.current = content
          editor.commands.setContent(parseContent(content))
        }
      } catch (error) {
        console.error('Error syncing content:', error)
      }
    }
  }, [editor, content])

  return { editor, isMounted, isUploading, handleImageUpload, flushPendingContent }
}
