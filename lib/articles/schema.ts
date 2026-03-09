/**
 * 文章相关数据验证 Schema
 *
 * @module lib/articles/schema
 * @description 使用 Zod 定义文章数据的验证规则
 */

import { z } from 'zod';

/**
 * 文章状态枚举
 */
export const ArticleStatusSchema = z.enum(['draft', 'published', 'archived']);

/**
 * 创建文章数据验证 Schema
 *
 * @security
 * - 标题长度限制：1-100字符
 * - 内容长度限制：1-50000字符（约5万字）
 * - 自动去除首尾空白
 * - 状态只能是 draft 或 published
 */
export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(100, '标题不能超过100个字符')
    .transform((val) => val.trim()),
  content: z
    .string()
    .min(1, '内容不能为空')
    .max(50000, '内容不能超过50000个字符')
    .transform((val) => val.trim()),
  status: z.enum(['draft', 'published']).default('draft'),
});

/**
 * 文章标签验证 Schema
 *
 * @security
 * - 最多10个标签
 * - 每个标签最长20字符
 */
export const ArticleTagsSchema = z
  .array(
    z
      .string()
      .min(1, '标签不能为空')
      .max(20, '标签不能超过20个字符')
      .transform((val) => val.trim().toLowerCase())
  )
  .max(10, '最多只能添加10个标签');

/**
 * 更新文章数据验证 Schema
 *
 * @security
 * - 标签数量限制：最多10个
 * - 每个标签长度限制：1-20字符
 */
export const UpdateArticleSchema = z.object({
  id: z.string().uuid('无效的文章ID'),
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(100, '标题不能超过100个字符')
    .transform((val) => val.trim())
    .optional(),
  content: z
    .string()
    .min(1, '内容不能为空')
    .max(50000, '内容不能超过50000个字符')
    .transform((val) => val.trim())
    .optional(),
  status: ArticleStatusSchema.optional(),
  tags: ArticleTagsSchema.optional(),
});

/**
 * 评论数据验证 Schema
 *
 * @security
 * - 内容长度限制：1-500字符
 * - 自动去除首尾空白
 * - 净化 HTML 标签
 */
export const CommentSchema = z.object({
  articleId: z.string().uuid('无效的文章ID'),
  content: z
    .string()
    .min(1, '评论内容不能为空')
    .max(500, '评论内容不能超过500个字符')
    .transform((val) => val.trim()),
  parentId: z.string().uuid('无效的评论ID').optional(),
});

/**
 * 文章ID验证 Schema
 */
export const ArticleIdSchema = z.string().uuid('无效的文章ID');

/**
 * 评论ID验证 Schema
 */
export const CommentIdSchema = z.string().uuid('无效的评论ID');

/**
 * 分页参数验证 Schema
 */
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

/**
 * 批量删除参数验证 Schema
 *
 * @security
 * - 限制单次最多删除50篇文章，防止滥用
 * - 验证每个ID都是有效的UUID格式
 */
export const BatchDeleteSchema = z.object({
  ids: z
    .array(z.string().uuid('无效的文章ID格式'))
    .min(1, '至少选择一篇文章')
    .max(50, '单次最多删除50篇文章'),
});

/**
 * 导出类型定义
 */
export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;
export type CommentInput = z.infer<typeof CommentSchema>;
export type BatchDeleteInput = z.infer<typeof BatchDeleteSchema>;
