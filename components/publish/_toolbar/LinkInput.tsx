'use client'

/**
 * 链接输入组件
 * 
 * 气泡菜单内的链接输入框
 * 在选区下方显示，支持插入/编辑/取消链接
 */

import { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { Link, X, Check } from '@/components/icons'

interface LinkInputProps {
  editor: Editor | null
  onClose: () => void
}

export function LinkInput({ editor, onClose }: LinkInputProps) {
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动聚焦并预填充已有链接
  useEffect(() => {
    inputRef.current?.focus()
    
    if (editor?.isActive('link')) {
      const attrs = editor.getAttributes('link')
      setUrl(attrs.href || '')
    }
  }, [editor])

  // 确认插入/更新链接
  const handleConfirm = () => {
    if (!editor || !url.trim()) return
    
    // 自动添加 https:// 前缀
    let finalUrl = url.trim()
    if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl
    }
    
    editor.chain().focus().setLink({ href: finalUrl }).run()
    onClose()
  }

  // 取消链接
  const handleUnlink = () => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
    onClose()
  }

  // 键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const hasLink = editor?.isActive('link')

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-xf-light px-3 py-2">
      <Link className="w-4 h-4 text-xf-primary flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入链接地址..."
        className="w-48 px-2 py-1 text-sm bg-transparent border-none outline-none text-xf-dark placeholder:text-xf-medium"
      />
      
      {/* 取消链接按钮（仅当已有链接时显示）*/}
      {hasLink && (
        <button
          onClick={handleUnlink}
          title="取消链接"
          className="p-1 rounded text-xf-error hover:bg-xf-error/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* 确认按钮 */}
      <button
        onClick={handleConfirm}
        disabled={!url.trim()}
        title="确认"
        className="p-1 rounded text-xf-success hover:bg-xf-success/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4" />
      </button>
    </div>
  )
}
