/**
 * 文章操作类型定义
 * @module types/article/actions
 * @description Server Actions 返回类型
 */

import type { Article } from './article';
import type { Comment } from './comment';

// ============================================
// 点赞相关类型
// ============================================

/**
 * 文章点赞结果接口
 * @interface ToggleLikeResult
 * @description 文章点赞/取消点赞操作的返回结果
 */
export interface ToggleLikeResult {
  /** 是否成功 */
  success: boolean;
  /** 当前是否已点赞 */
  liked: boolean;
  /** 当前点赞数 */
  likes: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 评论点赞结果接口
 * @interface ToggleCommentLikeResult
 * @description 评论点赞/取消点赞操作的返回结果
 */
export interface ToggleCommentLikeResult {
  /** 是否成功 */
  success: boolean;
  /** 当前是否已点赞 */
  liked: boolean;
  /** 当前点赞数 */
  likes: number;
  /** 错误信息 */
  error?: string;
}

// ============================================
// 评论操作类型
// ============================================

/**
 * 提交评论结果接口
 * @interface SubmitCommentResult
 * @description 提交评论操作的返回结果
 */
export interface SubmitCommentResult {
  /** 是否成功 */
  success: boolean;
  /** 新创建的评论 */
  comment?: Comment;
  /** 错误信息 */
  error?: string;
}

/**
 * 获取评论列表结果接口
 * @interface GetCommentsResult
 * @description 获取评论列表操作的返回结果
 */
export interface GetCommentsResult {
  /** 是否成功 */
  success: boolean;
  /** 评论列表 */
  comments?: Comment[];
  /** 评论总数 */
  totalCount?: number;
  /** 是否还有更多 */
  hasMore?: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 删除评论结果接口
 * @interface DeleteCommentResult
 * @description 删除评论操作的返回结果
 */
export interface DeleteCommentResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

// ============================================
// 文章 CRUD 类型
// ============================================

/**
 * 创建文章结果接口
 * @interface CreateArticleResult
 * @description 创建文章操作的返回结果
 */
export interface CreateArticleResult {
  /** 是否成功 */
  success: boolean;
  /** 新创建的文章 */
  article?: Article;
  /** 错误信息 */
  error?: string;
}

/**
 * 更新文章结果接口
 * @interface UpdateArticleResult
 * @description 更新文章操作的返回结果
 */
export interface UpdateArticleResult {
  /** 是否成功 */
  success: boolean;
  /** 更新后的文章 */
  article?: Article;
  /** 错误信息 */
  error?: string;
}

/**
 * 删除文章结果接口
 * @interface DeleteArticleResult
 * @description 删除文章操作的返回结果
 */
export interface DeleteArticleResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}
