'use server';

/**
 * 文章增删改 Server Actions
 *
 * @module lib/articles/actions/mutate
 * @description 处理文章的创建、更新、删除操作
 *
 * @安全特性
 * - 使用 Zod 进行输入验证
 * - 内容净化防止 XSS
 * - 严格的权限验证
 * - 速率限制保护
 *
 * @性能优化
 * - 使用异步 revalidate，避免阻塞操作
 * - 数据库操作和缓存刷新分离
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/permissions';
import { ensureUserProfile } from '../helpers/profile';
import { checkPublishArticleTask } from '@/lib/rewards/tasks';
import { CreateArticleSchema, ArticleIdSchema } from '../schema';
import { verifyArticleOwnership } from './_secure';
import { checkServerRateLimit } from '@/lib/security/rateLimitServer';
import { sanitizeRichText, sanitizePlainText, generateExcerpt } from '@/lib/utils/purify';
import { validateArticleContent } from '@/lib/security/contentFilter';
import { revalidatePathsAsync } from './utils';

/**
 * 创建文章/草稿
 *
 * @param data - 文章数据
 * @param data.title - 文章标题
 * @param data.content - 文章内容
 * @param data.status - 文章状态 (draft/published)
 * @returns 创建的文章数据
 *
 * @安全说明
 * - 使用 Zod 验证输入数据
 * - 净化 HTML 内容防止 XSS
 * - 速率限制防止滥用
 *
 * @性能说明
 * - 数据库操作完成后立即返回
 * - 缓存刷新在后台异步执行
 */
export async function createArticle(data: {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 速率限制检查：每用户每小时最多创建 10 篇文章，每分钟最多 2 篇
  const hourlyRateLimit = checkServerRateLimit(`create:${user.id}:hourly`, {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1小时
  });

  const minuteRateLimit = checkServerRateLimit(`create:${user.id}:minute`, {
    maxAttempts: 2,
    windowMs: 60 * 1000, // 1分钟
  });

  if (!hourlyRateLimit.allowed) {
    throw new Error('操作过于频繁，请稍后再试');
  }

  if (!minuteRateLimit.allowed) {
    throw new Error('操作过于频繁，请稍后再试');
  }

  // Zod 输入验证
  const validationResult = CreateArticleSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0]?.message || '输入数据无效';
    throw new Error(errorMessage);
  }

  const validatedData = validationResult.data;

  // 确保用户资料存在（使用 upsert 原子操作）
  const profileCreated = await ensureUserProfile(user.id, user.email);
  if (!profileCreated) {
    throw new Error('用户资料初始化失败，请重试');
  }

  // 敏感词检测（仅对正式发布的文章进行严格检测）
  if (validatedData.status === 'published') {
    const contentValidation = validateArticleContent(
      validatedData.title,
      validatedData.content
    );
    if (!contentValidation.valid) {
      throw new Error(`内容审核未通过: ${contentValidation.errors.join('; ')}`);
    }
  }

  // 净化 HTML 内容防止 XSS - 使用 DOMPurify
  const sanitizedContent = sanitizeRichText(validatedData.content);
  const sanitizedTitle = sanitizePlainText(validatedData.title);
  const excerpt = generateExcerpt(sanitizedContent, 100);

  // 构建插入数据，直接发布时设置 published_at
  const insertData: {
    title: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
    author_id: string;
    tags: string[];
    like_count: number;
    comment_count: number;
    view_count: number;
    published_at?: string;
  } = {
    title: sanitizedTitle,
    content: sanitizedContent,
    excerpt,
    status: validatedData.status,
    author_id: user.id,
    tags: [],
    like_count: 0,
    comment_count: 0,
    view_count: 0,
  };

  // 直接发布时设置发布时间
  if (validatedData.status === 'published') {
    insertData.published_at = new Date().toISOString();
  }

  const { data: article, error } = await supabase
    .from('articles')
    .insert(insertData)
    .select('id, title, content, excerpt, status, created_at, updated_at, published_at')
    .single();

  if (error) {
    console.error('创建文章失败:', error);
    throw new Error(`创建失败: ${error.message}`);
  }

  revalidatePathsAsync(['/drafts', '/home']);

  // 检测发布文章任务 - 仅当发布正式文章时触发
  if (data.status === 'published') {
    Promise.resolve().then(async () => {
      const taskSuccess = await checkPublishArticleTask()
      if (!taskSuccess) {
        console.warn('[任务系统] 发布文章任务进度更新失败，不影响文章发布')
      }
    })
  }

  return {
    ...article,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
  };
}

/**
 * 删除文章
 *
 * @param id - 文章ID
 * @returns 删除结果
 *
 * @安全说明
 * - 验证文章ID格式
 * - 验证用户是否为文章作者
 */
export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 验证文章ID格式
  const idValidation = ArticleIdSchema.safeParse(id);
  if (!idValidation.success) {
    throw new Error('无效的文章ID');
  }

  // 验证用户是否为文章作者
  const isOwner = await verifyArticleOwnership(id, user.id);
  if (!isOwner) {
    throw new Error('无权删除此文章');
  }

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id);

  if (error) throw new Error(`删除失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home']);

  return { success: true };
}

/**
 * 更新文章状态（发布/归档/草稿）
 *
 * @param id - 文章ID
 * @param status - 新状态
 * @returns 更新结果
 *
 * @安全说明
 * - 验证文章ID格式
 * - 验证用户是否为文章作者
 * - 防止越权修改他人文章状态
 */
export async function updateArticleStatus(
  id: string,
  status: 'published' | 'archived' | 'draft'
) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 验证文章ID格式
  const idValidation = ArticleIdSchema.safeParse(id);
  if (!idValidation.success) {
    throw new Error('无效的文章ID');
  }

  // 验证用户是否为文章作者
  const isOwner = await verifyArticleOwnership(id, user.id);
  if (!isOwner) {
    throw new Error('无权修改此文章状态');
  }

  const updateData: { status: string; published_at?: string } = { status };

  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id);

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home']);

  return { success: true };
}

/**
 * 更新文章内容
 *
 * @param id - 文章ID
 * @param data - 更新数据
 * @returns 更新结果
 *
 * @安全说明
 * - 验证文章ID格式
 * - 验证用户是否为文章作者
 * - 净化 HTML 内容防止 XSS
 */
export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
  }
) {
  const supabase = await createClient();
  const user = await requireAuth();

  // 验证文章ID格式
  const idValidation = ArticleIdSchema.safeParse(id);
  if (!idValidation.success) {
    throw new Error('无效的文章ID');
  }

  // 验证用户是否为文章作者
  const isOwner = await verifyArticleOwnership(id, user.id);
  if (!isOwner) {
    throw new Error('无权修改此文章');
  }

  // 速率限制检查
  const rateLimit = checkServerRateLimit(`update:${user.id}`, {
    maxAttempts: 30,
    windowMs: 60 * 60 * 1000, // 1小时
  });

  if (!rateLimit.allowed) {
    throw new Error('操作过于频繁，请稍后再试');
  }

  const updateData: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
  } = {};

  // 净化并验证输入数据
  if (data.title !== undefined) {
    const sanitizedTitle = sanitizePlainText(data.title.trim());
    if (sanitizedTitle.length < 1 || sanitizedTitle.length > 100) {
      throw new Error('标题长度必须在1-100字符之间');
    }
    updateData.title = sanitizedTitle;
  }

  if (data.content !== undefined) {
    const sanitizedContent = sanitizeRichText(data.content);
    if (sanitizedContent.length < 1 || sanitizedContent.length > 50000) {
      throw new Error('内容长度必须在1-50000字符之间');
    }
    updateData.content = sanitizedContent;
    updateData.excerpt = data.excerpt || generateExcerpt(sanitizedContent, 100);
  }

  // 标签验证：白名单验证，防止恶意标签
  if (data.tags !== undefined) {
    // 定义允许的标签白名单（实际项目中可从配置或数据库加载）
    const allowedTags = [
      '技术', '生活', '学习', '工作', '娱乐', '健康', '科技', '教育', '旅游', '美食',
      '体育', '艺术', '音乐', '电影', '读书', '编程', '设计', '创业', '投资', '职场'
    ];
    
    // 验证标签是否在白名单中
    const validTags = data.tags.filter(tag => allowedTags.includes(tag));
    if (validTags.length !== data.tags.length) {
      throw new Error('包含不允许的标签');
    }
    
    updateData.tags = validTags;
  }

  const { data: article, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('author_id', user.id)
    .select('id, title, content, excerpt, status, created_at, updated_at')
    .single();

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home', `/article/${id}`]);

  return {
    ...article,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
  };
}
