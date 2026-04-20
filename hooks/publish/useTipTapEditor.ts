'use client'

/**
 * @fileoverview TipTap 编辑器 Hook
 * @module hooks/publish/useTipTapEditor
 */

import { useEditor, type Editor, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Paragraph from '@tiptap/extension-paragraph'
import Blockquote from '@tiptap/extension-blockquote'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import type { EditorView } from '@tiptap/pm/view'
import type { Slice } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import type { JSONContent } from '@tiptap/core'
import { useEffect, useMemo, useRef, useCallback } from 'react'
import { ParaNodeView } from '@/components/publish/_blocks/ParaNodeView'
import { useDebounce } from '@/hooks/useDebounce'

interface TipTapEditorOptions {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const EMPTY_DOCUMENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [] }],
}

function parseContent(content: string): JSONContent {
  if (!content) return EMPTY_DOCUMENT
  try {
    const parsed = JSON.parse(content) as JSONContent
    if (parsed.type === 'doc') {
      return parsed
    }
    return EMPTY_DOCUMENT
  } catch {
    return EMPTY_DOCUMENT
  }
}

function shouldNormalizeMarkdownPaste(text: string): boolean {
  const lines = text.split(/\r?\n/)
  return lines.some((line) => {
    const trimmed = line.trim()
    return (
      /^#{1,6}\s+/.test(trimmed) ||
      /^[-*+]\s+/.test(trimmed) ||
      /^\d+\.\s+/.test(trimmed) ||
      /^>\s+/.test(trimmed) ||
      /\*\*.+?\*\*/.test(trimmed) ||
      /__.+?__/.test(trimmed) ||
      /`.+?`/.test(trimmed)
    )
  })
}

function normalizeMarkdownToPlainText(text: string): string {
  const normalizeInline = (line: string): string =>
    line
      // 粗体
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      // 斜体
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // 行内代码
      .replace(/`(.+?)`/g, '$1')
      // 链接 [文本](url) -> 文本
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')

  return text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      return normalizeInline(
        trimmed
        .replace(/^#{1,6}\s+/, '')
        .replace(/^[-*+]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^>\s+/, '')
      )
    })
    .join('\n')
    .trim()
}

export function useTipTapEditor({
  content,
  onChange,
  placeholder = '开始书写你的故事...',
}: TipTapEditorOptions) {
  const pendingContentRef = useRef<string>(content)

  const debouncedOnChange = useDebounce(
    (jsonContent: JSONContent) => {
      const jsonString = JSON.stringify(jsonContent)
      pendingContentRef.current = jsonString
      onChange(jsonString)
    },
    300
  )

  const initialContent = useMemo(() => parseContent(content), [content])

  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          paragraph: false,
          blockquote: false,
          horizontalRule: {
            HTMLAttributes: { class: 'editor-hr' },
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
        Color.configure({ types: ['textStyle'] }),
        Blockquote.configure({
          HTMLAttributes: { class: 'editor-blockquote' },
        }),
      ],
      content: initialContent,
      editable: true,
      immediatelyRender: false,
      onUpdate: ({ editor }: { editor: Editor }) => {
        debouncedOnChange(editor.getJSON())
      },
      editorProps: {
        attributes: {
          class: 'article-content article-content-editor max-w-none focus:outline-none',
        },
        handlePaste(view: EditorView, event: ClipboardEvent) {
          const plainText = event.clipboardData?.getData('text/plain') || ''
          const htmlText = event.clipboardData?.getData('text/html') || ''
          if (!plainText) return false

          // 仅处理纯文本粘贴；保留富文本粘贴默认行为
          if (htmlText.trim()) return false

          if (!shouldNormalizeMarkdownPaste(plainText)) return false

          const normalized = normalizeMarkdownToPlainText(plainText)
          if (!normalized || normalized === plainText.trim()) return false

          event.preventDefault()
          const { from, to } = view.state.selection
          const tr = view.state.tr.insertText(normalized, from, to)
          view.dispatch(tr)
          return true
        },
        handleDrop(view: EditorView, event: DragEvent, _slice: Slice, moved: boolean) {
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

  const editor = useEditor(editorConfig, [])

  const flushPendingContent = useCallback(() => {
    onChange(pendingContentRef.current)
  }, [onChange])

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

export type { JSONContent as TipTapJSON }
