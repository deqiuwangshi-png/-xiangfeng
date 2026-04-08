'use client'

/**
 * @fileoverview TipTap 编辑器 Hook
 * @module hooks/publish/useTipTapEditor
 * @description 使用 JSON 格式存储内容，提供 TipTap 编辑器实例
 *
 * @类型依赖
 * - 类型定义位于: types/publish/editor.ts
 * - 导入: TipTapJSON, TipTapEditorOptions
 * - 注意: TipTapJSON 从 lib/utils/json 重新导出
 */

import {
  useEditor,
  type Editor,
  ReactNodeViewRenderer,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Paragraph from '@tiptap/extension-paragraph'
import Blockquote from '@tiptap/extension-blockquote'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import type { EditorView } from '@tiptap/pm/view'
import type { Slice } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import {
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react'
import { ParaNodeView } from '@/components/publish/_blocks/ParaNodeView'
import {
  type TipTapJSON,
  type TipTapEditorOptions,
  EMPTY_DOCUMENT,
} from '@/types/publish/editor'
import { useDebounce } from '@/hooks/useDebounce'

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
}: TipTapEditorOptions) {
  const pendingContentRef = useRef<string>(content)

  /**
   * 防抖处理的内容更新函数
   * @性能优化 延迟 300ms 触发 onChange，减少重渲染
   */
  const debouncedOnChange = useDebounce(
    (jsonContent: TipTapJSON) => {
      const jsonString = JSON.stringify(jsonContent)
      pendingContentRef.current = jsonString
      onChange(jsonString)
    },
    300
  )

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
        Placeholder.configure({
          placeholder,
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
        }),
        TextStyle,
        Color.configure({
          types: ['textStyle'],
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class: 'editor-blockquote',
          },
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
         * 处理拖拽事件 - 支持节点拖拽排序
         */
        handleDrop(view: EditorView, event: DragEvent, _slice: Slice, moved: boolean) {
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
  // 空依赖数组确保只在客户端创建，避免 SSR hydration 问题
  const editor = useEditor(editorConfig, [])

  const flushPendingContent = useCallback(() => {
    onChange(pendingContentRef.current)
  }, [onChange])

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

  return { editor, flushPendingContent }
}

// 重新导出类型以便向后兼容
export type { TipTapJSON }
