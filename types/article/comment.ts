/**
 * 评论类型定义
 * @module types/article/comment
 * @description 评论相关的数据类型
 */

import type { ArticleAuthor } from './article';

/**
 * 评论数据接口
 * @interface Comment
 * @description 评论的完整数据结构
 */
export interface Comment {
  /** 评论ID */
  id: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 评论内容 */
  content: string;
  /** 创建时间 */
  created_at: string;
  /** 点赞数 */
  likes: number;
  /** 当前用户是否点赞 */
  liked: boolean;
  /** 回复列表 */
  replies?: Comment[];
}

/**
 * 带作者信息的评论数据接口
 * @interface CommentWithAuthor
 * @description 包含完整作者信息的评论数据
 */
export interface CommentWithAuthor {
  /** 评论ID */
  id: string;
  /** 评论内容 */
  content: string;
  /** 创建时间 */
  created_at: string;
  /** 点赞数 */
  likes: number;
  /** 当前用户是否点赞 */
  liked: boolean;
  /** 作者ID */
  author_id: string;
  /** 文章ID */
  article_id: string;
  /** 作者信息 */
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: 'user' | 'admin' | 'super_admin';
  };
}

/**
 * 评论提交数据接口
 * @interface CommentSubmitData
 * @description 提交评论时所需的数据
 */
export interface CommentSubmitData {
  /** 文章ID */
  articleId: string;
  /** 评论内容 */
  content: string;
  /** 父评论ID（回复时使用） */
  parentId?: string;
}
