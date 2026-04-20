/**
 * 权限系统类型定义
 * @module types/permissions
 * @description 权限控制相关的类型定义，可在服务端和客户端共享
 */

/**
 * 用户角色类型
 * @typedef {('anonymous' | 'authenticated' | 'admin')} UserRole
 */
export type UserRole = 'anonymous' | 'authenticated' | 'admin';

/**
 * 需要保护的写入操作类型
 * @typedef WriteOperation
 */
export type WriteOperation =
  | 'create'   // 创建内容（文章、评论等）
  | 'update'   // 更新内容
  | 'delete'   // 删除内容
  | 'like'     // 点赞
  | 'comment'  // 评论
  | 'follow'   // 关注
  | 'bookmark' // 收藏
  | 'upload'   // 上传文件
  | 'report'   // 举报
  | 'reply';   // 回复

/**
 * 权限检查结果接口
 * @interface PermissionCheckResult
 */
export interface PermissionCheckResult {
  /** 是否允许操作 */
  allowed: boolean;
  /** 错误信息 */
  error?: string;
  /** 用户角色 */
  role: UserRole;
}

/**
 * 认证用户信息（简化版，用于客户端）
 * @interface AuthUserInfo
 */
export interface AuthUserInfo {
  id: string;
  email?: string;
  role: UserRole;
}
