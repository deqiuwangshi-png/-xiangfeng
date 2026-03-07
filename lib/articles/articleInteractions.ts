'use server';

/**
 * 文章交互 Server Actions
 *
 * @module lib/articles/articleInteractions
 * @description 处理文章相关的用户交互：点赞、收藏、评论
 *
 * 统一使用 Server Actions 替代 API Routes，减少 HTTP 开销
 */

import { createClient } from '@/lib/supabase/server';
import { getArticleCommentsPaginated } from './articleQueries';

/**
 * 点赞/取消点赞结果
 */
export interface ToggleLikeResult {
  success: boolean;
  liked: boolean;
  likes: number;
  error?: string;
}

/**
 * 收藏/取消收藏结果
 */
export interface ToggleBookmarkResult {
  success: boolean;
  favorited: boolean;
  favorites: number;
  error?: string;
}

/**
 * 评论提交结果
 */
export interface SubmitCommentResult {
  success: boolean;
  comment?: {
    id: string;
    content: string;
    created_at: string;
    likes: number;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    liked: boolean;
  };
  error?: string;
}

/**
 * 评论列表结果
 */
export interface GetCommentsResult {
  success: boolean;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    likes: number;
    liked: boolean;
    author_id: string;
    article_id: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  totalCount?: number;
  hasMore?: boolean;
  error?: string;
}

/**
 * 检查并创建用户资料
 *
 * @param userId - 用户ID
 * @param email - 用户邮箱
 * @returns 是否成功
 */
async function ensureUserProfile(userId: string, email?: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!profile) {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
      });

    if (error) {
      console.error('创建用户资料失败:', error);
      return false;
    }
  }

  return true;
}

/**
 * 文章点赞/取消点赞
 *
 * @param articleId - 文章ID
 * @returns 点赞结果
 */
export async function toggleArticleLike(articleId: string): Promise<ToggleLikeResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, liked: false, likes: 0, error: '请先登录' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, liked: false, likes: 0, error: '用户资料初始化失败' };
    }

    {/* 检查是否已点赞 */}
    const { data: existingLike, error: checkError } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('检查点赞状态失败:', checkError);
      return { success: false, liked: false, likes: 0, error: '操作失败' };
    }

    let liked = false;

    if (existingLike) {
      {/* 已点赞，取消点赞 */}
      const { error: deleteError } = await supabase
        .from('article_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('取消点赞失败:', deleteError);
        return { success: false, liked: false, likes: 0, error: '取消点赞失败' };
      }
      liked = false;
    } else {
      {/* 未点赞，添加点赞 */}
      const { error: insertError } = await supabase
        .from('article_likes')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      if (insertError) {
        console.error('点赞失败:', insertError);
        return { success: false, liked: false, likes: 0, error: '点赞失败' };
      }
      liked = true;
    }

    {/* 获取最新的点赞数 */}
    const { data: article } = await supabase
      .from('articles')
      .select('like_count')
      .eq('id', articleId)
      .single();

    return {
      success: true,
      liked,
      likes: article?.like_count || 0,
    };
  } catch (error) {
    console.error('点赞操作失败:', error);
    return { success: false, liked: false, likes: 0, error: '操作失败' };
  }
}

/**
 * 文章收藏/取消收藏
 *
 * @param articleId - 文章ID
 * @returns 收藏结果
 */
export async function toggleArticleBookmark(articleId: string): Promise<ToggleBookmarkResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, favorited: false, favorites: 0, error: '请先登录' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, favorited: false, favorites: 0, error: '用户资料初始化失败' };
    }

    {/* 检查是否已收藏 */}
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('检查收藏状态失败:', checkError);
      return { success: false, favorited: false, favorites: 0, error: '操作失败' };
    }

    let favorited = false;

    if (existingFavorite) {
      {/* 已收藏，取消收藏 */}
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existingFavorite.id);

      if (deleteError) {
        console.error('取消收藏失败:', deleteError);
        return { success: false, favorited: false, favorites: 0, error: '取消收藏失败' };
      }
      favorited = false;
    } else {
      {/* 未收藏，添加收藏 */}
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      if (insertError) {
        console.error('收藏失败:', insertError);
        return { success: false, favorited: false, favorites: 0, error: '收藏失败' };
      }
      favorited = true;
    }

    {/* 获取最新的收藏数 */}
    const { data: article } = await supabase
      .from('articles')
      .select('favorite_count')
      .eq('id', articleId)
      .single();

    return {
      success: true,
      favorited,
      favorites: article?.favorite_count || 0,
    };
  } catch (error) {
    console.error('收藏操作失败:', error);
    return { success: false, favorited: false, favorites: 0, error: '操作失败' };
  }
}

/**
 * 获取文章评论列表（分页）
 *
 * @param articleId - 文章ID
 * @param page - 页码
 * @param limit - 每页数量
 * @returns 评论列表结果
 */
export async function getArticleComments(
  articleId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetCommentsResult> {
  try {
    const { comments, totalCount, hasMore } = await getArticleCommentsPaginated(
      articleId,
      page,
      limit
    );

    return {
      success: true,
      comments,
      totalCount,
      hasMore,
    };
  } catch (error) {
    console.error('获取评论失败:', error);
    return { success: false, error: '获取评论失败' };
  }
}

/**
 * 提交文章评论
 *
 * @param articleId - 文章ID
 * @param content - 评论内容
 * @returns 提交结果
 */
export async function submitArticleComment(
  articleId: string,
  content: string
): Promise<SubmitCommentResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: '请先登录' };
    }

    {/* 验证评论内容 */}
    if (!content || content.trim().length === 0) {
      return { success: false, error: '评论内容不能为空' };
    }

    if (content.length > 500) {
      return { success: false, error: '评论内容不能超过500字' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, error: '用户资料初始化失败' };
    }

    {/* 插入评论到数据库 */}
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        article_id: articleId,
        author_id: user.id,
        content: content.trim(),
      })
      .select('*')
      .single();

    if (error || !comment) {
      console.error('插入评论失败:', error);
      return { success: false, error: `评论提交失败: ${error?.message || '未知错误'}` };
    }

    {/* 获取用户资料 */}
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    return {
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        likes: 0,
        author: {
          id: user.id,
          name: profile?.username || '匿名用户',
          avatar: profile?.avatar_url || undefined,
        },
        liked: false,
      },
    };
  } catch (error) {
    console.error('提交评论失败:', error);
    return { success: false, error: '评论提交失败' };
  }
}

/**
 * 评论点赞/取消点赞结果
 */
export interface ToggleCommentLikeResult {
  success: boolean;
  liked: boolean;
  likes: number;
  error?: string;
}

/**
 * 评论点赞/取消点赞
 *
 * @param commentId - 评论ID
 * @returns 点赞结果
 */
export async function toggleCommentLike(commentId: string): Promise<ToggleCommentLikeResult> {
  const supabase = await createClient();

  try {
    {/* 获取当前登录用户 */}
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, liked: false, likes: 0, error: '请先登录' };
    }

    {/* 确保用户资料存在 */}
    const profileCreated = await ensureUserProfile(user.id, user.email);
    if (!profileCreated) {
      return { success: false, liked: false, likes: 0, error: '用户资料初始化失败' };
    }

    {/* 检查是否已点赞 */}
    const { data: existingLike, error: checkError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('检查评论点赞状态失败:', checkError);
      return { success: false, liked: false, likes: 0, error: '操作失败' };
    }

    let liked = false;

    if (existingLike) {
      {/* 已点赞，取消点赞 */}
      const { error: deleteError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('取消评论点赞失败:', deleteError);
        return { success: false, liked: false, likes: 0, error: '取消点赞失败' };
      }
      liked = false;
    } else {
      {/* 未点赞，添加点赞 */}
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
        });

      if (insertError) {
        console.error('评论点赞失败:', insertError);
        return { success: false, liked: false, likes: 0, error: '点赞失败' };
      }
      liked = true;
    }

    {/* 获取最新点赞数 */}
    const { count } = await supabase
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    return {
      success: true,
      liked,
      likes: count || 0,
    };
  } catch (error) {
    console.error('评论点赞操作失败:', error);
    return { success: false, liked: false, likes: 0, error: '操作失败' };
  }
}
