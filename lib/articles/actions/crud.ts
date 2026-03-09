/**
 * 文章CRUD Server Actions 统一导出
 *
 * @module lib/articles/actions/crud
 * @description 统一导出所有文章操作函数，保持向后兼容
 * @warning 此文件不包含 'use server'，仅作为类型安全的重新导出
 *
 * @deprecated 建议直接从子模块导入：
 * - 查询操作：import { getArticles } from './query'
 * - 增删改：import { createArticle } from './mutate'
 * - 批量操作：import { batchDeleteArticles } from './batch'
 */

// 查询操作
export {
  getArticles,
  getPublishedArticles,
  getPublicArticleById,
} from './query';

// 增删改操作
export {
  createArticle,
  deleteArticle,
  updateArticle,
  updateArticleStatus,
} from './mutate';

// 批量操作
export {
  batchDeleteArticles,
} from './batch';
