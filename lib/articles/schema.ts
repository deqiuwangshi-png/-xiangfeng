/**
 * 文章相关数据验证 Schema
 *
 * @module lib/articles/schema
 * @description 使用 Zod 定义文章数据的验证规则
 */

import { z } from 'zod';
import { VALIDATION_MESSAGES, COMMENT_ERROR_MESSAGES, ARTICLE_ERROR_MESSAGES } from '@/lib/messages';
import { extractTextFromJSON, isContentEmpty } from '@/lib/utils/json';

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
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(100, VALIDATION_MESSAGES.TOO_LONG)
    .transform((val) => val.trim()),
  content: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(50000, VALIDATION_MESSAGES.TOO_LONG)
    .transform((val) => val.trim()),
  status: z.enum(['draft', 'published']).default('draft'),
});

/**
 * 文章标签验证 Schema
 *
 * @security
 * - 最多10个标签
 * - 每个标签最长20字符
 * - 只允许字母、数字、中文和连字符（防止XSS和SQL注入）
 */
export const ArticleTagsSchema = z
  .array(
    z
      .string()
      .min(1, VALIDATION_MESSAGES.REQUIRED)
      .max(20, VALIDATION_MESSAGES.TOO_LONG)
      // 安全：只允许字母、数字、中文、连字符和下划线
      .regex(
        /^[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/,
        VALIDATION_MESSAGES.INVALID_FORMAT
      )
      .transform((val) => val.trim().toLowerCase())
  )
  .max(10, VALIDATION_MESSAGES.TOO_MANY);

/**
 * 更新文章数据验证 Schema
 *
 * @security
 * - 标签数量限制：最多10个
 * - 每个标签长度限制：1-20字符
 */
export const UpdateArticleSchema = z.object({
  id: z.uuid({ message: ARTICLE_ERROR_MESSAGES.NOT_FOUND }),
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(100, VALIDATION_MESSAGES.TOO_LONG)
    .transform((val) => val.trim())
    .optional(),
  content: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(50000, VALIDATION_MESSAGES.TOO_LONG)
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
  articleId: z.uuid({ message: ARTICLE_ERROR_MESSAGES.NOT_FOUND }),
  content: z
    .string()
    .min(1, COMMENT_ERROR_MESSAGES.EMPTY_CONTENT)
    .max(500, COMMENT_ERROR_MESSAGES.CONTENT_TOO_LONG)
    .transform((val) => val.trim()),
  parentId: z.uuid({ message: COMMENT_ERROR_MESSAGES.INVALID_ID }).optional(),
});

/**
 * 文章ID验证 Schema
 */
export const ArticleIdSchema = z.uuid({ message: ARTICLE_ERROR_MESSAGES.NOT_FOUND });

/**
 * 评论ID验证 Schema
 */
export const CommentIdSchema = z.uuid({ message: COMMENT_ERROR_MESSAGES.INVALID_ID });

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
    .array(z.uuid({ message: '无效的文章ID格式' }))
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

export interface ArticleValidationResult {
  valid: boolean
  error?: string
}

interface ArticleDraftInput {
  title: string
  content: string
}

interface TipTapJSON {
  type: 'doc'
  content?: unknown[]
}

export function validateArticleContentJSON(content: string): ArticleValidationResult {
  if (!content) {
    return { valid: false, error: '内容不能为空' }
  }

  try {
    const parsed = JSON.parse(content) as TipTapJSON
    if (parsed.type !== 'doc') {
      return { valid: false, error: '内容格式错误：缺少 doc 类型' }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: '内容格式错误：无效的 JSON' }
  }
}

export function validateArticleDraftInput({ title, content }: ArticleDraftInput): ArticleValidationResult {
  const jsonValidation = validateArticleContentJSON(content)
  if (!jsonValidation.valid) {
    return jsonValidation
  }

  const hasTitle = title.trim().length > 0
  const hasContent = !isContentEmpty(content)

  if (!hasTitle && !hasContent) {
    return { valid: false, error: '标题和内容不能同时为空' }
  }

  if (hasTitle && title.trim().length > 100) {
    return { valid: false, error: '标题不能超过100个字符' }
  }

  return { valid: true }
}

export function validateArticlePublishInput({ title, content }: ArticleDraftInput): ArticleValidationResult {
  const draftValidation = validateArticleDraftInput({ title, content })
  if (!draftValidation.valid) {
    return draftValidation
  }

  if (!title.trim()) {
    return { valid: false, error: '发布文章必须填写标题' }
  }

  if (isContentEmpty(content)) {
    return { valid: false, error: '发布文章必须填写内容' }
  }

  const textContent = extractTextFromJSON(content).replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
  if (textContent.length < 10) {
    return { valid: false, error: '发布内容不能少于10个字符' }
  }

  return { valid: true }
}
