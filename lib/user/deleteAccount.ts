'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * 删除账户结果接口
 */
export interface DeleteAccountResult {
  success: boolean
  error?: string
}

/**
 * 硬删除用户账户
 * 
 * @returns 删除结果
 * 
 * @description
 * 彻底删除用户账户及关联数据（方案：1A, 2B, 4A）：
 * 1. 删除用户发布的所有文章
 * 2. 匿名化用户的评论（保留内容，用户显示为"已删除用户"）
 * 3. 删除 profiles 表数据
 * 4. 使用 Admin API 彻底删除 Auth 用户
 * 5. 退出登录
 * 
 * ⚠️ 此操作不可逆，立即生效
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  try {
    const supabase = await createClient()
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: '未登录或登录已过期' }
    }

    const userId = user.id

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
      .from('likes')
      .delete()
      .eq('user_id', userId)

    if (likesError) {
      console.error('删除点赞记录失败:', likesError)
    }

    // 4. 删除用户的收藏记录
    const { error: bookmarksError } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)

    if (bookmarksError) {
      console.error('删除收藏记录失败:', bookmarksError)
    }

    // 5. 删除 profiles 表数据
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('删除用户资料失败:', profileError)
      // 继续执行，尝试删除 Auth 用户
    }

    // 6. 【硬删除】使用 Admin API 彻底删除 Auth 用户
    const adminClient = createAdminClient()
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error('删除 Auth 用户失败:', deleteAuthError)
      return { success: false, error: '删除账户失败：' + deleteAuthError.message }
    }

    // 7. 尝试退出当前会话（用户已删除，会话可能已失效，忽略错误）
    try {
      await supabase.auth.signOut()
    } catch {
      // 忽略退出错误，用户已被删除
    }

    return {
      success: true,
    }

  } catch (error) {
    console.error('删除账户时出错:', error)
    return { success: false, error: '删除账户失败，请稍后重试' }
  }
}
