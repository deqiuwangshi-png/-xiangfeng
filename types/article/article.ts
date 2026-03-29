/**
 * 文章类型定义
 * @module types/article/article
 * @description 文章相关的数据类型
 */

import type { ArticleStatus } from './common';

/**
 * 数据库文章数据接口
 * @interface Article
 * @description 与数据库 articles 表结构对应
 */
export interface Article {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 摘要 */
  summary: string;
  /** 状态 */
  status: ArticleStatus;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 文章作者信息接口
 * @interface ArticleAuthor
 * @description 文章作者的基本信息
 */
export interface ArticleAuthor {
  /** 作者ID */
  id: string;
  /** 作者名称 */
  name: string;
  /** 作者头像 */
  avatar?: string;
  /** 作者简介 */
  bio?: string;
  /** 用户角色 */
  role?: 'user' | 'admin' | 'super_admin';
}

/**
 * 带作者信息的文章接口
 * @interface ArticleWithAuthor
 * @description 包含完整作者信息的文章数据
 */
export interface ArticleWithAuthor {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 摘要 */
  summary: string | null;
  /** 标签 */
  tags: string[];
  /** 状态 */
  status: ArticleStatus;
  /** 封面图片 */
  cover_image: string | null;
  /** 作者ID */
  author_id: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 发布时间 */
  publishedAt: string;
  /** 阅读时长（分钟） */
  readTime: number;
  /** 点赞数 */
  likesCount: number;
  /** 评论数 */
  commentsCount: number;
  /** 浏览数 */
  viewsCount: number;
  /** 当前用户是否点赞 */
  isLiked?: boolean;
  /** 当前用户是否收藏 */
  isBookmarked?: boolean;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 文章卡片展示数据接口
 * @interface ArticleCardData
 * @description 用于文章列表卡片展示的数据
 */
export interface ArticleCardData {
  /** 文章ID */
  id: string;
  /** 标题 */
  title: string;
  /** 摘要 */
  summary: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 发布时间 - 可能为 null（如草稿未发布） */
  publishedAt: string | null;
  /** 阅读时长（分钟） */
  readTime: number;
  /** 浏览数 */
  viewsCount: number;
}
