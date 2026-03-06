'use client'

import { useState, useCallback } from 'react'
import type { Comment } from '../types'

/**
 * 评论提交 Hook
 *
 * @param articleId - 文章ID
 * @param onSuccess - 提交成功回调
 * @returns 表单状态和方法
 */
export function useCommentSubmit(
  articleId: string,
  onSuccess: (comment: Comment) => void
) {
  const [newComment, setNewComment] = useState('')
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  /**
   * 提交评论
   *
   * @param content - 评论内容
   * @returns 是否提交成功
   */
  const submit = useCallback(
    async (content: string): Promise<boolean> => {
      if (!content.trim() || sending) return false

      setSending(true)
      setSubmitError(null)

      try {
        const response = await fetch(`/api/articles/${articleId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })

        const data = await response.json()

        if (response.ok && data.comment) {
          const newCommentData: Comment = {
            id: data.comment.id,
            author: data.comment.author,
            content: data.comment.content,
            created_at: data.comment.created_at || new Date().toISOString(),
            likes: data.comment.likes || 0,
            liked: false,
          }
          onSuccess(newCommentData)
          setNewComment('')
          return true
        } else {
          const errorMsg = data.error || '评论发表失败，请重试'
          setSubmitError(errorMsg)
          console.error('评论提交失败:', data)
          return false
        }
      } catch (error) {
        console.error('Failed to submit comment:', error)
        setSubmitError('网络错误，请检查网络连接后重试')
        return false
      } finally {
        setSending(false)
      }
    },
    [articleId, sending, onSuccess]
  )

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setSubmitError(null)
  }, [])

  return {
    newComment,
    setNewComment,
    sending,
    submitError,
    submit,
    clearError,
  }
}
