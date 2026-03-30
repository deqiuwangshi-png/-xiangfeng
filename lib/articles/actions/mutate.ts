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
import { extractImageUrls } from '@/lib/media/utils';

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
  const hourlyRateLimit = await checkServerRateLimit(`create:${user.id}:hourly`, {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1小时
  });

  const minuteRateLimit = await checkServerRateLimit(`create:${user.id}:minute`, {
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
 * 删除文章关联的媒体资源
 *
 * @param supabase - Supabase客户端
 * @param articleId - 文章ID
 * @returns 删除结果
 *
 * @安全说明
 * - 只删除与指定文章关联的媒体
 * - 同时删除Storage中的文件
 * - 错误不影响主流程，记录日志
 */
async function deleteArticleMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string
): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    // 1. 查询关联的媒体记录
    const { data: mediaRecords, error: fetchError } = await supabase
      .from('media')
      .select('id, storage_path')
      .eq('article_id', articleId);

    if (fetchError) {
      console.error('查询文章媒体失败:', fetchError);
      return { success: false, deletedCount: 0, error: fetchError.message };
    }

    if (!mediaRecords || mediaRecords.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    // 2. 从Storage删除文件
    const storagePaths = mediaRecords.map((m) => m.storage_path);
    const { error: storageError } = await supabase.storage
      .from('wenjian')
      .remove(storagePaths);

    if (storageError) {
      console.error('删除Storage文件失败:', storageError);
      // 继续删除数据库记录，不中断流程
    }

    // 3. 删除数据库记录
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('article_id', articleId);

    if (deleteError) {
      console.error('删除媒体记录失败:', deleteError);
      return { success: false, deletedCount: 0, error: deleteError.message };
    }

    return { success: true, deletedCount: mediaRecords.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('删除文章媒体异常:', message);
    return { success: false, deletedCount: 0, error: message };
  }
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
 * - 级联删除关联的媒体资源
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

  // 1. 先删除关联的媒体资源（级联删除）
  const mediaResult = await deleteArticleMedia(supabase, id);
  if (!mediaResult.success) {
    console.warn(`文章 ${id} 的媒体资源删除失败:`, mediaResult.error);
    // 继续删除文章，不中断流程
  }

  // 2. 删除文章
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id);

  if (error) throw new Error(`删除失败: ${error.message}`);

  revalidatePathsAsync(['/drafts', '/home']);

  return {
    success: true,
    mediaDeleted: mediaResult.deletedCount,
  };
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
 * 清理文章中不再使用的旧图片
 *
 * @param supabase - Supabase客户端
 * @param articleId - 文章ID
 * @param oldContent - 旧内容
 * @param newContent - 新内容
 * @returns 清理结果
 *
 * @说明
 * - 对比新旧内容中的图片URL
 * - 被移除的图片标记为 temp 状态
 * - 错误不影响主流程
 */
async function cleanupUnusedImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string,
  oldContent: string,
  newContent: string
): Promise<{ success: boolean; cleanedCount: number; error?: string }> {
  try {
    const oldUrls = extractImageUrls(oldContent);
    const newUrls = extractImageUrls(newContent);

    // 找出被移除的图片
    const removedUrls = oldUrls.filter(url => !newUrls.includes(url));

    if (removedUrls.length === 0) {
      return { success: true, cleanedCount: 0 };
    }

    // 将被移除的图片标记为 temp 状态，解除与文章的关联
    const { data, error } = await supabase
      .from('media')
      .update({
        status: 'temp',
        article_id: null,
        updated_at: new Date().toISOString(),
      })
      .in('url', removedUrls)
      .eq('article_id', articleId)
      .select('id');

    if (error) {
      console.error('清理旧图片失败:', error);
      return { success: false, cleanedCount: 0, error: error.message };
    }

    return { success: true, cleanedCount: data?.length || 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('清理旧图片异常:', message);
    return { success: false, cleanedCount: 0, error: message };
  }
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
 * - 自动清理不再使用的旧图片
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
  const rateLimit = await checkServerRateLimit(`update:${user.id}`, {
    maxAttempts: 30,
    windowMs: 60 * 60 * 1000, // 1小时
  });

  if (!rateLimit.allowed) {
    throw new Error('操作过于频繁，请稍后再试');
  }

  // 如果需要更新内容，先获取旧内容用于对比
  let oldContent = '';
  if (data.content !== undefined) {
    const { data: oldArticle } = await supabase
      .from('articles')
      .select('content')
      .eq('id', id)
      .single();
    oldContent = oldArticle?.content || '';
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

  // 清理不再使用的旧图片（在文章更新成功后执行）
  if (data.content !== undefined && oldContent) {
    const cleanupResult = await cleanupUnusedImages(supabase, id, oldContent, data.content);
    if (!cleanupResult.success) {
      console.warn(`文章 ${id} 的旧图片清理失败:`, cleanupResult.error);
      // 不影响主流程，继续执行
    }
  }

  revalidatePathsAsync(['/drafts', '/home', `/article/${id}`]);

  return {
    ...article,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
  };
}
