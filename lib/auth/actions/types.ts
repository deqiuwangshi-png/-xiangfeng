/**
 * 认证操作类型定义
 * @module lib/auth/actions/types
 */

/**
 * 认证结果接口
 */
export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}
