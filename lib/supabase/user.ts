/**
 * 用户认证工具（兼容层）
 * @module lib/supabase/user
 * @description 此文件为兼容层，所有函数从 lib/auth/server.ts 重新导出
 *
 * @统一认证 2026-04-07
 * - 此文件保留用于向后兼容，避免破坏现有导入
 * - 新代码应直接使用 import { getCurrentUser } from '@/lib/auth/server'
 * - 实际实现已迁移到 lib/auth/server.ts
 */
// 直接重新导出所有函数，避免重复定义
import {
  getCurrentUser,
  isAuthenticated,
  getCurrentUserId,
  getCurrentUserWithProfile,
  type UserProfile,
} from '@/lib/auth/server'

// 重新导出类型
export type { UserProfile }

// 重新导出函数
export {
  getCurrentUser,
  isAuthenticated,
  getCurrentUserId,
  getCurrentUserWithProfile,
}
