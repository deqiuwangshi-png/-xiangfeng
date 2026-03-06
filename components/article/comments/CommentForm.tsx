'use client'

import { useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import type { CommentFormProps } from './types'

/**
 * 评论表单组件
 *
 * @param onSubmit - 提交回调
 * @param currentUser - 当前用户
 * @param disabled - 是否禁用
 * @returns 评论表单JSX
 */
export function CommentForm({
  onSubmit,
  currentUser,
  disabled = false,
}: CommentFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      alert('请先登录后再发表评论')
      return
    }

    const content = textareaRef.current?.value || ''
    if (!content.trim()) return

    const success = await onSubmit(content)
    if (success && textareaRef.current) {
      textareaRef.current.value = ''
    }
  }

  return (
    <form className="comment-input-area" onSubmit={handleSubmit}>
      <div className="comment-input-wrapper">
        <textarea
          ref={textareaRef}
          className="comment-input"
          placeholder={currentUser ? '写下你的评论...' : '请先登录后评论'}
          rows={1}
          maxLength={500}
          disabled={!currentUser || disabled}
        />
        <button
          type="submit"
          className="send-comment-btn"
          disabled={!currentUser || disabled}
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  )
}
