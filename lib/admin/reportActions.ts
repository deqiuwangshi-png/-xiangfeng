'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/server'
import { isSuperAdmin } from './utils'

export type ReportReviewStatus = 'pending' | 'processing' | 'resolved' | 'dismissed'

const VALID_REVIEW_STATUSES: ReportReviewStatus[] = ['pending', 'processing', 'resolved', 'dismissed']

interface AdminArticleReportRow {
  id: string
  article_id: string
  reporter_id: string
  type: string
  reason: string | null
  status: ReportReviewStatus
  created_at: string
}

export interface AdminArticleReportItem {
  id: string
  articleId: string
  articleTitle: string
  reporterId: string
  reporterName: string
  type: string
  reason: string | null
  status: ReportReviewStatus
  createdAt: string
}

interface AdminActionResult {
  success: boolean
  error?: string
}

export async function getArticleReportsForAdmin(
  status?: ReportReviewStatus
): Promise<{ success: boolean; data?: AdminArticleReportItem[]; error?: string }> {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { success: false, error: '未登录' }
  }

  if (!(await isSuperAdmin(currentUser.id))) {
    return { success: false, error: '仅超级管理员可访问' }
  }

  const supabase = await createClient()
  let query = supabase
    .from('article_reports')
    .select('id, article_id, reporter_id, type, reason, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status && VALID_REVIEW_STATUSES.includes(status)) {
    query = query.eq('status', status)
  }

  const { data: reports, error } = await query
  if (error) {
    return { success: false, error: '获取举报列表失败' }
  }

  const rows = (reports || []) as AdminArticleReportRow[]
  if (rows.length === 0) {
    return { success: true, data: [] }
  }

  const articleIds = Array.from(new Set(rows.map((row) => row.article_id)))
  const reporterIds = Array.from(new Set(rows.map((row) => row.reporter_id)))

  const [{ data: articles }, { data: reporters }] = await Promise.all([
    supabase.from('articles').select('id, title').in('id', articleIds),
    supabase.from('profiles').select('id, username').in('id', reporterIds),
  ])

  const articleMap = new Map((articles || []).map((item) => [item.id, item.title || '未知文章']))
  const reporterMap = new Map(
    (reporters || []).map((item) => [item.id, item.username || '匿名用户'])
  )

  return {
    success: true,
    data: rows.map((row) => ({
      id: row.id,
      articleId: row.article_id,
      articleTitle: articleMap.get(row.article_id) || '未知文章',
      reporterId: row.reporter_id,
      reporterName: reporterMap.get(row.reporter_id) || '匿名用户',
      type: row.type,
      reason: row.reason,
      status: row.status,
      createdAt: row.created_at,
    })),
  }
}

export async function reviewArticleReportStatus(
  reportId: string,
  nextStatus: ReportReviewStatus
): Promise<AdminActionResult> {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { success: false, error: '未登录' }
  }

  if (!(await isSuperAdmin(currentUser.id))) {
    return { success: false, error: '仅超级管理员可访问' }
  }

  if (!VALID_REVIEW_STATUSES.includes(nextStatus)) {
    return { success: false, error: '状态无效' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('article_reports')
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  if (error) {
    return { success: false, error: '更新举报状态失败' }
  }

  revalidatePath('/admin/reports')
  return { success: true }
}

