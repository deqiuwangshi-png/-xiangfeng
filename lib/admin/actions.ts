/**
 * 管理员管理 Server Actions
 * @module lib/admin/actions
 * @description 提供管理员相关的服务端操作
 * @security 所有操作都需要管理员权限验证
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth/core/user'
import {
  isSuperAdmin,
  isAdmin,
  canChangeRole,
  getRoleDisplayName
} from './utils'
import type { UserRole } from '@/types/supabase'

/**
 * 操作结果类型
 */
interface ActionResult {
  success: boolean
  error?: string
  message?: string
}

/**
 * 设置用户角色（仅超级管理员）
 * @param targetUserId - 目标用户ID
 * @param newRole - 新角色
 * @returns 操作结果
 */
export async function setUserRole(
  targetUserId: string,
  newRole: UserRole
): Promise<ActionResult> {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: '未登录' }
    }
    
    // 检查权限
    const permissionCheck = await canChangeRole(currentUser.id, targetUserId, newRole)
    if (!permissionCheck.allowed) {
      return { success: false, error: permissionCheck.reason }
    }
    
    // 使用数据库函数设置角色
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('set_user_role', {
      target_user_id: targetUserId,
      new_role: newRole
    })
    
    if (error) {
      console.error('设置用户角色失败:', error)
      return { success: false, error: '设置角色失败: ' + error.message }
    }
    
    if (!data) {
      return { success: false, error: '设置角色失败' }
    }
    
    // 刷新相关页面缓存
    revalidatePath('/admin')
    revalidatePath('/profile/' + targetUserId)
    
    return { 
      success: true, 
      message: `已将用户角色设置为 ${getRoleDisplayName(newRole)}` 
    }
  } catch (err) {
    console.error('设置用户角色时出错:', err)
    return { success: false, error: '设置角色时出错' }
  }
}

/**
 * 获取所有管理员列表（仅超级管理员）
 * @returns 管理员列表
 */
export async function getAdmins(): Promise<{
  success: boolean
  data?: Array<{
    id: string
    username: string
    avatar_url: string | null
    role: UserRole
    created_at: string
  }>
  error?: string
}> {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: '未登录' }
    }
    
    // 只有超级管理员可以查看管理员列表
    if (!(await isSuperAdmin(currentUser.id))) {
      return { success: false, error: '只有超级管理员可以查看管理员列表' }
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, role, created_at')
      .in('role', ['admin', 'super_admin'])
      .order('role', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取管理员列表失败:', error)
      return { success: false, error: '获取管理员列表失败' }
    }
    
    return { success: true, data: data || [] }
  } catch (err) {
    console.error('获取管理员列表时出错:', err)
    return { success: false, error: '获取管理员列表时出错' }
  }
}

/**
 * 删除用户（仅超级管理员）
 * @param targetUserId - 目标用户ID
 * @returns 操作结果
 */
export async function deleteUser(targetUserId: string): Promise<ActionResult> {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: '未登录' }
    }
    
    // 只有超级管理员可以删除用户
    if (!(await isSuperAdmin(currentUser.id))) {
      return { success: false, error: '只有超级管理员可以删除用户' }
    }
    
    // 不能删除自己
    if (currentUser.id === targetUserId) {
      return { success: false, error: '不能删除自己的账号' }
    }
    
    // 检查目标用户是否为超级管理员
    if (await isSuperAdmin(targetUserId)) {
      return { success: false, error: '不能删除其他超级管理员' }
    }
    
    // 使用 Admin Client 删除用户
    const adminClient = createAdminClient()
    const { error } = await adminClient.auth.admin.deleteUser(targetUserId)
    
    if (error) {
      console.error('删除用户失败:', error)
      return { success: false, error: '删除用户失败: ' + error.message }
    }
    
    // 刷新相关页面缓存
    revalidatePath('/admin')
    
    return { success: true, message: '用户已删除' }
  } catch (err) {
    console.error('删除用户时出错:', err)
    return { success: false, error: '删除用户时出错' }
  }
}

/**
 * 暂停/恢复用户账号（管理员及以上）
 * @param targetUserId - 目标用户ID
 * @param suspend - true为暂停，false为恢复
 * @returns 操作结果
 */
export async function toggleUserStatus(
  targetUserId: string,
  suspend: boolean
): Promise<ActionResult> {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: '未登录' }
    }
    
    // 检查权限
    const currentRole = await isSuperAdmin(currentUser.id) ? 'super_admin' : 
                       await isAdmin(currentUser.id) ? 'admin' : 'user'
    
    if (currentRole === 'user') {
      return { success: false, error: '无权操作' }
    }
    
    // 不能操作自己
    if (currentUser.id === targetUserId) {
      return { success: false, error: '不能操作自己的账号' }
    }
    
    // 管理员不能操作其他管理员
    const targetIsAdmin = await isAdmin(targetUserId)
    if (currentRole === 'admin' && targetIsAdmin) {
      return { success: false, error: '管理员不能操作其他管理员' }
    }
    
    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ 
        account_status: suspend ? 'suspended' : 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUserId)
    
    if (error) {
      console.error('更新用户状态失败:', error)
      return { success: false, error: '操作失败: ' + error.message }
    }
    
    // 刷新相关页面缓存
    revalidatePath('/admin')
    revalidatePath('/profile/' + targetUserId)
    
    return { 
      success: true, 
      message: suspend ? '用户已暂停' : '用户已恢复' 
    }
  } catch (err) {
    console.error('更新用户状态时出错:', err)
    return { success: false, error: '操作时出错' }
  }
}

/**
 * 获取当前用户角色信息
 * @returns 当前用户角色
 */
export async function getCurrentUserRole(): Promise<{
  success: boolean
  role?: UserRole
  isAdmin: boolean
  isSuperAdmin: boolean
  error?: string
}> {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, isAdmin: false, isSuperAdmin: false, error: '未登录' }
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()
    
    if (error || !data) {
      return { success: false, isAdmin: false, isSuperAdmin: false, error: '获取角色失败' }
    }
    
    const role = data.role
    return {
      success: true,
      role,
      isAdmin: role === 'admin' || role === 'super_admin',
      isSuperAdmin: role === 'super_admin'
    }
  } catch (err) {
    console.error('获取当前用户角色时出错:', err)
    return { success: false, isAdmin: false, isSuperAdmin: false, error: '获取角色时出错' }
  }
}
