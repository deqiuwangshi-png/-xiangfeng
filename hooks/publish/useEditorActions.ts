'use client'

/**
 * 编辑器操作 Hook - 简化版
 * 只保留防重复点击，其他逻辑交给 Supabase
 */

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateSummary } from '@/lib/utils/html'
import { toast } from 'sonner'

/**
 * 编辑器操作 Hook
 */
export function useEditorActions<T extends { title: string; content: string; draftId: string | null; isPublished: boolean }>(
  editorState: T,
  setEditorState: React.Dispatch<React.SetStateAction<T>>
) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const saveLockRef = useRef(false)
  const publishLockRef = useRef(false)
  const draftIdRef = useRef<string | null>(editorState.draftId)

  useEffect(() => {
    draftIdRef.current = editorState.draftId
  }, [editorState.draftId])

  const getCurrentUserId = async (supabase: ReturnType<typeof createClient>): Promise<string> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (user?.id) return user.id
    if (userError) console.error('supabase.auth.getUser error:', userError)

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('supabase.auth.getSession error:', sessionError)
    }

    if (session?.user?.id) return session.user.id
    throw new Error('登录状态失效，请重新登录后发布')
  }

  const createDraftWithSupabase = async (
    supabase: ReturnType<typeof createClient>,
    userId: string,
    title: string,
    content: string,
    status: 'draft' | 'published'
  ) => {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        excerpt: generateSummary(content, 100),
        status,
        author_id: userId,
        tags: [],
        like_count: 0,
        comment_count: 0,
        view_count: 0,
        ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
      })
      .select('id,author_id')
      .single()

    if (error || !data) {
      throw new Error(error?.message || '创建失败')
    }
    if (!data.author_id || data.author_id !== userId) {
      throw new Error('发布失败：用户身份校验未通过')
    }

    return data.id as string
  }

  const updateDraftWithSupabase = async (
    supabase: ReturnType<typeof createClient>,
    userId: string,
    id: string,
    payload: { title?: string; content?: string; status?: 'draft' | 'published' }
  ) => {
    const updatePayload: Record<string, unknown> = { ...payload }

    if (payload.content !== undefined) {
      updatePayload.excerpt = generateSummary(payload.content, 100)
    }
    if (payload.status === 'published') {
      updatePayload.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('articles')
      .update(updatePayload)
      .eq('id', id)
      .eq('author_id', userId)
      .select('id')
      .single()

    if (error) {
      throw new Error(error.message)
    }
    if (!data?.id) {
      throw new Error('更新失败：无权限或文章不存在')
    }
  }

  /**
   * 保存草稿
   */
  const saveDraft = async (options?: { silent?: boolean }) => {
    if (saveLockRef.current || isSaving) return
    if (!editorState.title.trim() && !editorState.content.trim()) {
      return
    }
    saveLockRef.current = true
    setIsSaving(true)

    try {
      if (draftIdRef.current) {
        const supabase = createClient()
        const userId = await getCurrentUserId(supabase)
        await updateDraftWithSupabase(supabase, userId, draftIdRef.current, {
          title: editorState.title,
          content: editorState.content,
        })
      } else {
        const supabase = createClient()
        const userId = await getCurrentUserId(supabase)
        const articleId = await createDraftWithSupabase(
          supabase,
          userId,
          editorState.title,
          editorState.content,
          'draft'
        )
        draftIdRef.current = articleId
        setEditorState(prev => ({ ...prev, draftId: articleId }))
      }
      if (!options?.silent) {
        router.push('/drafts')
      }
    } catch (error) {
      if (!options?.silent) {
        const message = error instanceof Error ? error.message : '保存失败，请重试'
        toast.error(message)
      }
      throw error
    } finally {
      setIsSaving(false)
      saveLockRef.current = false
    }
  }

  /**
   * 发布文章
   */
  const publishContent = async () => {
    if (publishLockRef.current || isPublishing) return
    if (!editorState.title.trim()) {
      toast.error('标题不能为空')
      return
    }
    if (!editorState.content.trim()) {
      toast.error('内容不能为空')
      return
    }
    publishLockRef.current = true
    setIsPublishing(true)

    try {
      let articleId: string
      const supabase = createClient()
      const userId = await getCurrentUserId(supabase)

      if (draftIdRef.current) {
        await updateDraftWithSupabase(supabase, userId, draftIdRef.current, {
          title: editorState.title,
          content: editorState.content,
          status: 'published',
        })
        articleId = draftIdRef.current
      } else {
        articleId = await createDraftWithSupabase(
          supabase,
          userId,
          editorState.title,
          editorState.content,
          'published'
        )
      }

      setEditorState(prev => ({ ...prev, isPublished: true }))
      router.push(`/article/${articleId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '发布失败，请重试'
      toast.error(message)
      throw error
    } finally {
      setIsPublishing(false)
      publishLockRef.current = false
    }
  }

  return {
    saveDraft,
    publishContent,
    isSaving,
    isPublishing,
  }
}
