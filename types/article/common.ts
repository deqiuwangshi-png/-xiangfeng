/**
 * 文章模块通用类型定义
 * @module types/article/common
 * @description 基础类型和常量定义
 */

// ============================================
// 常量定义
// ============================================

/**
 * 未登录用户可查看的最大评论数
 * @constant MAX_COMMENTS_WITHOUT_LOGIN
 */
export const MAX_COMMENTS_WITHOUT_LOGIN = 3;

// ============================================
// 基础枚举类型
// ============================================

/**
 * 文章状态类型
 * @type ArticleStatus
 * @description 文章的发布状态
 */
export type ArticleStatus = 'draft' | 'published' | 'archived';
