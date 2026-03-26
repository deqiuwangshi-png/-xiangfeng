/**
 * 管理员权限检查工具
 * @module lib/admin/utils
 * @description 提供管理员权限检查和角色管理功能
 * @security 所有函数仅在服务端使用，不要暴露到客户端
 */

import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/supabase'

/**
 * 获取用户角色
 * @param userId - 用户ID
 * @returns 用户角色，如果未找到返回 'user'
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    console.error('获取用户角色失败:', error?.message)
    return 'user'
  }
  
  return data.role
}

/**
 * 检查用户是否为超级管理员
 * @param userId - 用户ID
 * @returns 是否为超级管理员
 */
export async function isSuperAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false
  const role = await getUserRole(userId)
  return role === 'super_admin'
}

/**
 * 检查用户是否为管理员（包含超级管理员）
 * @param userId - 用户ID
 * @returns 是否为管理员
 */
export async function isAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false
  const role = await getUserRole(userId)
  return role === 'admin' || role === 'super_admin'
}

/**
 * 检查用户是否有权限操作目标用户
 * @param currentUserId - 当前操作用户ID
 * @param targetUserId - 目标用户ID
 * @returns 是否有权限
 */
export async function canManageUser(
  currentUserId: string | null | undefined,
  targetUserId: string
): Promise<boolean> {
  if (!currentUserId) return false
  
  // 用户可以管理自己
  if (currentUserId === targetUserId) return true
  
  const currentRole = await getUserRole(currentUserId)
  const targetRole = await getUserRole(targetUserId)
  
  // 超级管理员可以管理任何人
  if (currentRole === 'super_admin') return true
  
  // 管理员只能管理普通用户
  if (currentRole === 'admin' && targetRole === 'user') return true
  
  return false
}

/**
 * 检查是否可以修改角色
 * @param currentUserId - 当前操作用户ID
 * @param targetUserId - 目标用户ID
 * @param newRole - 新角色
 * @returns 是否可以修改
 */
export async function canChangeRole(
  currentUserId: string | null | undefined,
  targetUserId: string,
  newRole: UserRole
): Promise<{ allowed: boolean; reason?: string }> {
  if (!currentUserId) {
    return { allowed: false, reason: '未登录' }
  }
  
  const currentRole = await getUserRole(currentUserId)
  const targetRole = await getUserRole(targetUserId)
  
  // 只有超级管理员可以修改角色
  if (currentRole !== 'super_admin') {
    return { allowed: false, reason: '只有超级管理员可以修改用户角色' }
  }
  
  // 不能修改自己的角色（防止意外降级自己）
  if (currentUserId === targetUserId && newRole !== 'super_admin') {
    return { allowed: false, reason: '不能降低自己的角色等级' }
  }
  
  // 不能修改其他超级管理员的角色
  if (targetRole === 'super_admin' && currentUserId !== targetUserId) {
    return { allowed: false, reason: '不能修改其他超级管理员的角色' }
  }
  
  return { allowed: true }
}

/**
 * 获取角色显示名称
 * @param role - 用户角色
 * @returns 角色显示名称
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    user: '普通用户',
    admin: '管理员',
    super_admin: '超级管理员'
  }
  return roleNames[role]
}

/**
 * 获取角色等级（用于比较）
 * @param role - 用户角色
 * @returns 角色等级（数字越大权限越高）
 */
export function getRoleLevel(role: UserRole): number {
  const roleLevels: Record<UserRole, number> = {
    user: 1,
    admin: 2,
    super_admin: 3
  }
  return roleLevels[role]
}

/**
 * 比较两个角色的权限等级
 * @param role1 - 角色1
 * @param role2 - 角色2
 * @returns 正数表示role1权限更高，负数表示role2权限更高，0表示相等
 */
export function compareRoles(role1: UserRole, role2: UserRole): number {
  return getRoleLevel(role1) - getRoleLevel(role2)
}
