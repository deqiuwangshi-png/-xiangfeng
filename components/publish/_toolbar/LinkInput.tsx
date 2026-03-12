'use client'

/**
 * 链接输入组件
 *
 * 气泡菜单内的链接输入框
 * 在选区下方显示，支持插入/编辑/取消链接
 *
 * @security 只允许 http/https/mailto 协议，阻止危险协议
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { Link, X, Check, AlertCircle } from '@/components/icons'

interface LinkInputProps {
  editor: Editor | null
  onClose: () => void
}

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']

export function LinkInput({ editor, onClose }: LinkInputProps) {
  const getInitialUrl = useCallback(() => {
    if (editor?.isActive('link')) {
      return editor.getAttributes('link').href || ''
    }
    return ''
  }, [editor])

  const [url, setUrl] = useState(getInitialUrl)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isInitializedRef.current && editor?.isActive('link')) {
      isInitializedRef.current = true
    }
  }, [editor])

  const validateUrl = (input: string): { valid: boolean; url: string; error: string } => {
    const trimmed = input.trim()
    if (!trimmed) {
      return { valid: false, url: '', error: '请输入链接地址' }
    }

    const lowerInput = trimmed.toLowerCase()

    if (DANGEROUS_PROTOCOLS.some(p => lowerInput.startsWith(p))) {
      return { valid: false, url: '', error: '不允许使用此协议' }
    }

    let finalUrl = trimmed

    if (!ALLOWED_PROTOCOLS.some(p => lowerInput.startsWith(p))) {
      finalUrl = 'https://' + trimmed
    }

    try {
      new URL(finalUrl)
      return { valid: true, url: finalUrl, error: '' }
    } catch {
      return { valid: false, url: '', error: '无效的链接地址' }
    }
  }

  const handleConfirm = () => {
    if (!editor) return

    const result = validateUrl(url)
    if (!result.valid) {
      setError(result.error)
      return
    }

    editor.chain().focus().setLink({ href: result.url }).run()
    onClose()
  }

  const handleUnlink = () => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleInputChange = (value: string) => {
    setUrl(value)
    setError('')
  }

  const hasLink = editor?.isActive('link')

  return (
    <div className="flex flex-col gap-1 bg-white rounded-lg shadow-lg border border-xf-light px-3 py-2">
      <div className="flex items-center gap-2">
        <Link className="w-4 h-4 text-xf-primary shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入链接地址..."
          className="w-48 px-2 py-1 text-sm bg-transparent border-none outline-none text-xf-dark placeholder:text-xf-medium"
        />

        {hasLink && (
          <button
            onClick={handleUnlink}
            title="取消链接"
            className="p-1 rounded text-xf-error hover:bg-xf-error/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleConfirm}
          disabled={!url.trim()}
          title="确认"
          className="p-1 rounded text-xf-success hover:bg-xf-success/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-xs text-xf-error px-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
