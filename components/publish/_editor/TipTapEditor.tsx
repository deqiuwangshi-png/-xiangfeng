'use client'

import { useSyncExternalStore, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * 使用 useSyncExternalStore 检测客户端挂载状态
 *
 * @description
 * - 服务端：返回 false，显示占位符避免水合错误
 * - 客户端：返回 true，直接创建编辑器
 * - 无需 useEffect + setState，减少一次渲染
 *
 * @returns {boolean} 是否已挂载到客户端
 */
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {}, // 订阅函数：挂载状态不会变化，返回空清理函数
    () => true,     // getSnapshot：客户端直接返回 true
    () => false     // getServerSnapshot：服务端返回 false
  )
}

/**
 * TipTap 富文本编辑器组件
 *
 * 特性：
 * - 使用 useSyncExternalStore 避免 SSR 水合错误
 * - 减少一次渲染，提升性能
 * - 保持纯文本/Markdown 输入
 * - 展示时渲染 HTML
 *
 * 注意：此组件仅在客户端渲染
 */
export function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
  // 使用 useSyncExternalStore 替代 useState + useEffect
  const isMounted = useIsMounted()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 禁用不需要的功能
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || '开始书写你的故事...',
      }),
    ],
    content: value,
    editable: true,
    onUpdate: ({ editor }) => {
      // 输出 HTML 格式内容
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[60vh]',
      },
    },
  },
  [isMounted]) // 仅在挂载后创建编辑器

  // 同步外部 value 变化
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  // 避免 SSR 水合错误：服务端显示占位符
  if (!isMounted) {
    return (
      <div className="min-h-[60vh] py-4 pl-6 text-lg leading-[1.9] text-xf-dark bg-[#FAFBFD] rounded-lg">
        <span className="opacity-30 italic">{placeholder || '开始书写你的故事...'}</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-xf-primary via-xf-soft to-xf-accent rounded opacity-30" />
      <EditorContent
        editor={editor}
        className="text-lg leading-[1.9] text-xf-dark py-4 pl-6 min-h-[60vh] bg-[#FAFBFD] rounded-lg"
      />
    </div>
  )
}

export default TipTapEditor
