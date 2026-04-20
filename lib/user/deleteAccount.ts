'use server'

/**
 * 删除账户模块
 * @module lib/user/deleteAccount
 * @description 处理用户账户的硬删除操作
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */

import { createClient } from '@/lib/supabase/server'
import { clearSupabaseSessionCookies } from '@/lib/auth/clearSupabaseSessionCookies'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth/server'
import type { DeleteAccountResult } from '@/types'

/**
 * 硬删除用户账户
 *
 * @param password - 用户密码（二次验证）
 * @returns 删除结果
 *
 * @description
 * 彻底删除用户账户及关联数据（方案：1A, 2B, 4A）：
 * 1. 验证密码（二次确认）
 * 2. 删除用户发布的所有文章
 * 3. 匿名化用户的评论（保留内容，用户显示为"已删除用户"）
 * 4. 删除 profiles 表数据
 * 5. 使用 Admin API 彻底删除 Auth 用户
 * 6. 退出登录
 *
 * ⚠️ 此操作不可逆，立即生效
 */
export async function deleteAccount(password: string): Promise<DeleteAccountResult> {
  {/* 验证密码存在 */}
  if (!password || password.length < 1) {
    return { success: false, error: '请输入密码以确认删除账户' }
  }
  try {
    const supabase = await createClient()

    // 获取当前用户 - 使用统一认证入口
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    const userId = user.id
    const userEmail = user.email

    // 验证密码（二次确认）
    if (userEmail) {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      })
      if (verifyError) {
        return { success: false, error: '密码验证失败，请检查后重试' }
      }
    }

    // 1. 删除用户发布的所有文章（方案 1A）
    const { error: articlesError } = await supabase
      .from('articles')
      .delete()
      .eq('author_id', userId)

    if (articlesError) {
      console.error('删除文章失败:', articlesError)
      // 继续执行，不中断删除流程
    }

    // 2. 匿名化用户的评论（方案 2B）
    // 保留评论内容，但将用户关联清空
    const { error: commentsError } = await supabase
      .from('comments')
      .update({
        user_id: null,
        author_name: '已删除用户',
        author_avatar: null,
      })
      .eq('user_id', userId)

    if (commentsError) {
      console.error('匿名化评论失败:', commentsError)
      // 继续执行
    }

    // 3. 删除用户的点赞记录
    const { error: likesError } = await supabase
      .from('article_likes')
      .delete()
      .eq('user_id', userId)

    if (likesError) {
      console.error('删除点赞记录失败:', likesError)
    }

    // 4. 删除用户的收藏记录
    const { error: favoritesError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)

    if (favoritesError) {
      console.error('删除收藏记录失败:', favoritesError)
    }

    // 5. 删除 profiles 表数据
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('删除用户资料失败:', profileError)
      // 继续执行，Auth 用户必须删除
    }

    // 6. 使用 Admin API 彻底删除 Auth 用户（方案 4A）
    const adminClient = await createAdminClient()
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('删除 Auth 用户失败:', deleteError)
      return { success: false, error: '删除账户失败，请稍后重试' }
    }

    await supabase.auth.signOut({ scope: 'global' })
    await clearSupabaseSessionCookies()

    return { success: true }
  } catch (error) {
    console.error('删除账户时出错:', error)
    return { success: false, error: '删除账户时发生错误，请稍后重试' }
  }
}
