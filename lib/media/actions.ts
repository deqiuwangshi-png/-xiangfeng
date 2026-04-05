'use server'

/**
 * 媒体资源 Server Actions
 * @module lib/media/actions
 * @description 处理媒体资源的创建、状态更新和清理
 */

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/core/permissions'
import type { MediaStatus } from '@/types/media'

/**
 * 创建媒体记录
 *
 * @param params - 媒体记录参数
 * @returns 创建的记录ID
 */
export async function createMediaRecord(params: {
  url: string
  storage_path: string
  file_name: string
  file_size: number
  mime_type: string
  status: MediaStatus
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const user = await requireAuth()

    const { data, error } = await supabase
      .from('media')
      .insert({
        url: params.url,
        storage_path: params.storage_path,
        file_name: params.file_name,
        file_size: params.file_size,
        mime_type: params.mime_type,
        user_id: user.id,
        status: params.status,
        article_id: null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('创建媒体记录失败:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    console.error('创建媒体记录异常:', message)
    return { success: false, error: message }
  }
}

/**
 * 批量更新媒体状态
 * 在文章保存/发布时调用
 *
 * @param urls - 文章中使用的图片URL列表
 * @param articleId - 关联的文章ID
 * @param status - 新状态
 * @returns 更新结果
 */
export async function batchUpdateMediaStatus(
  urls: string[],
  articleId: string,
  status: MediaStatus = 'published'
): Promise<{ success: boolean; updated?: number; error?: string }> {
  try {
    const supabase = await createClient()
    await requireAuth()

    // 只更新 temp 状态的记录
    const { data, error } = await supabase
      .from('media')
      .update({
        status,
        article_id: articleId,
        updated_at: new Date().toISOString(),
      })
      .in('url', urls)
      .eq('status', 'temp')
      .select('id')

    if (error) {
      console.error('批量更新媒体状态失败:', error)
      return { success: false, error: error.message }
    }

    return { success: true, updated: data?.length || 0 }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    console.error('批量更新媒体状态异常:', message)
    return { success: false, error: message }
  }
}



/**
 * 清理未使用的临时媒体
 * 删除超过指定时间的temp状态记录及其Storage文件
 *
 * @param options - 清理选项
 * @param options.olderThan - 清理多久之前创建的temp媒体（毫秒），默认1小时
 * @param options.unassociatedOnly - 是否只清理未关联文章的媒体，默认true
 * @returns 清理结果
 */
export async function cleanupTempMedia(options?: {
  olderThan?: number
  unassociatedOnly?: boolean
}): Promise<{
  success: boolean
  deleted?: number
  error?: string
}> {
  try {
    const supabase = await createClient()
    await requireAuth()

    // 默认清理1小时前的temp媒体（缩短时间，更积极清理）
    const olderThanMs = options?.olderThan ?? 60 * 60 * 1000 // 1小时
    const cutoffTime = new Date(Date.now() - olderThanMs).toISOString()

    let query = supabase
      .from('media')
      .select('id, storage_path')
      .eq('status', 'temp')
      .lt('created_at', cutoffTime)

    // 默认只清理未关联文章的temp媒体（更安全的策略）
    if (options?.unassociatedOnly !== false) {
      query = query.is('article_id', null)
    }

    const { data: tempMedia, error: fetchError } = await query

    if (fetchError) {
      console.error('获取临时媒体失败:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (!tempMedia || tempMedia.length === 0) {
      return { success: true, deleted: 0 }
    }

    // 从Storage删除文件
    const storagePaths = tempMedia.map(m => m.storage_path)
    const { error: storageError } = await supabase.storage
      .from('wenjian')
      .remove(storagePaths)

    if (storageError) {
      console.error('删除Storage文件失败:', storageError)
      // 继续删除数据库记录，不中断流程
    }

    // 删除数据库记录
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .in('id', tempMedia.map(m => m.id))

    if (deleteError) {
      console.error('删除媒体记录失败:', deleteError)
      return { success: false, error: deleteError.message }
    }

    return { success: true, deleted: tempMedia.length }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    console.error('清理临时媒体异常:', message)
    return { success: false, error: message }
  }
}

/**
 * 清理当前用户的临时媒体
 * 用于发布页离开时的清理
 *
 * @returns 清理结果
 */
export async function cleanupUserTempMedia(): Promise<{
  success: boolean
  deleted?: number
  error?: string
}> {
  try {
    const supabase = await createClient()
    const user = await requireAuth()

    // 只清理当前用户、未关联文章的temp媒体
    const { data: tempMedia, error: fetchError } = await supabase
      .from('media')
      .select('id, storage_path')
      .eq('status', 'temp')
      .eq('user_id', user.id)
      .is('article_id', null)

    if (fetchError) {
      console.error('获取用户临时媒体失败:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (!tempMedia || tempMedia.length === 0) {
      return { success: true, deleted: 0 }
    }

    // 从Storage删除文件
    const storagePaths = tempMedia.map(m => m.storage_path)
    const { error: storageError } = await supabase.storage
      .from('wenjian')
      .remove(storagePaths)

    if (storageError) {
      console.error('删除Storage文件失败:', storageError)
    }

    // 删除数据库记录
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .in('id', tempMedia.map(m => m.id))

    if (deleteError) {
      console.error('删除媒体记录失败:', deleteError)
      return { success: false, error: deleteError.message }
    }

    return { success: true, deleted: tempMedia.length }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    console.error('清理用户临时媒体异常:', message)
    return { success: false, error: message }
  }
}

/**
 * 删除单个媒体记录及文件
 *
 * @param url - 媒体URL
 * @returns 删除结果
 */
export async function deleteMedia(url: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    await requireAuth()

    // 查询记录
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('storage_path')
      .eq('url', url)
      .single()

    if (fetchError || !media) {
      return { success: false, error: fetchError?.message || '记录不存在' }
    }

    // 删除Storage文件
    const { error: storageError } = await supabase.storage
      .from('wenjian')
      .remove([media.storage_path])

    if (storageError) {
      console.error('删除Storage文件失败:', storageError)
    }

    // 删除数据库记录
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('url', url)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    return { success: false, error: message }
  }
}
