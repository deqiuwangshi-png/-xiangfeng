'use client';

/**
 * 文章浏览量 Hook
 *
 * @module hooks/useArticleView
 * @description 处理文章浏览量的客户端统计和显示
 *
 * @特性
 * - 页面加载时自动增加浏览量
 * - 使用 sessionStorage 防止同一会话重复计数
 * - 乐观更新 UI
 * - 支持实时显示浏览量
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { incrementArticleView, getArticleViewCount } from '@/lib/articles/actions/view';

/**
 * useArticleView Hook 参数
 */
interface UseArticleViewOptions {
  /** 文章ID */
  articleId: string;
  /** 是否启用浏览量统计 */
  enabled?: boolean;
}

/**
 * useArticleView Hook 返回值
 */
interface UseArticleViewResult {
  /** 手动触发浏览量增加 */
  trackView: () => Promise<void>;
}

/**
 * useArticleViewCount Hook 参数
 */
interface UseArticleViewCountOptions {
  /** 文章ID */
  articleId: string;
  /** 初始浏览量 */
  initialCount: number;
}

/**
 * useArticleViewCount Hook 返回值
 */
interface UseArticleViewCountResult {
  /** 当前浏览量 */
  viewCount: number;
}

/**
 * 浏览量更新事件名称
 */
const VIEW_COUNT_UPDATE_EVENT = 'article:viewCountUpdate';

/**
 * 浏览量更新事件详情
 */
interface ViewCountUpdateDetail {
  articleId: string;
  newCount: number;
}

/**
 * 触发浏览量更新事件
 *
 * @param articleId - 文章ID
 * @param newCount - 新的浏览量
 */
export function dispatchViewCountUpdate(articleId: string, newCount: number): void {
  const event = new CustomEvent<ViewCountUpdateDetail>(VIEW_COUNT_UPDATE_EVENT, {
    detail: { articleId, newCount },
  });
  window.dispatchEvent(event);
}

/**
 * 文章浏览量统计 Hook
 *
 * @param options - 配置选项
 * @returns Hook 操作函数
 *
 * @example
 * ```tsx
 * function ArticlePage({ articleId }: { articleId: string }) {
 *   useArticleView({ articleId });
 *   return <div>...</div>;
 * }
 * ```
 */
export function useArticleView({
  articleId,
  enabled = true,
}: UseArticleViewOptions): UseArticleViewResult {
  const hasTrackedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  /**
   * 增加浏览量
   *
   * @description
   * - 检查 sessionStorage 防止重复
   * - 调用 Server Action 增加计数
   * - 标记已浏览状态
   */
  const trackView = useCallback(async () => {
    {/* 防止重复调用 */}
    if (hasTrackedRef.current) return;

    {/* 检查 sessionStorage */}
    const storageKey = `article_view_${articleId}`;
    const hasViewed = sessionStorage.getItem(storageKey);

    if (hasViewed) {
      hasTrackedRef.current = true;
      return;
    }

    try {
      const result = await incrementArticleView(articleId);

      if (result.success && isMountedRef.current) {
        {/* 标记为已浏览 */}
        sessionStorage.setItem(storageKey, '1');
        hasTrackedRef.current = true;

        {/* 获取最新浏览量并触发更新事件 */}
        const newCount = await getArticleViewCount(articleId);
        if (isMountedRef.current) {
          dispatchViewCountUpdate(articleId, newCount);
        }
      }
    } catch {
      {/* 静默处理错误，不影响用户体验 */}
    }
  }, [articleId]);

  /**
   * 自动统计浏览量
   */
  useEffect(() => {
    if (!enabled || !articleId) return;

    {/* 防止 StrictMode 重复创建定时器 */}
    if (timerRef.current) return;

    {/* 延迟执行，确保用户确实在阅读 */}
    timerRef.current = setTimeout(() => {
      trackView();
    }, 3000); // 3秒后统计，避免误刷

    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, [articleId, enabled]); // 故意不依赖 trackView，避免重复触发

  return { trackView };
}

/**
 * 文章浏览量显示 Hook
 *
 * @param options - 配置选项
 * @returns 当前浏览量
 *
 * @example
 * ```tsx
 * function ArticleHeader({ article }: { article: ArticleWithAuthor }) {
 *   const { viewCount } = useArticleViewCount({
 *     articleId: article.id,
 *     initialCount: article.viewsCount || 0,
 *   });
 *   return <span>{viewCount}</span>;
 * }
 * ```
 */
export function useArticleViewCount({
  articleId,
  initialCount,
}: UseArticleViewCountOptions): UseArticleViewCountResult {
  const [viewCount, setViewCount] = useState(initialCount);

  /**
   * 处理浏览量更新事件
   */
  const handleViewCountUpdate = useCallback((event: CustomEvent<ViewCountUpdateDetail>) => {
    if (event.detail.articleId === articleId) {
      setViewCount(event.detail.newCount);
    }
  }, [articleId]);

  /**
   * 监听浏览量更新事件
   */
  useEffect(() => {
    window.addEventListener(
      VIEW_COUNT_UPDATE_EVENT,
      handleViewCountUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        VIEW_COUNT_UPDATE_EVENT,
        handleViewCountUpdate as EventListener
      );
    };
  }, [handleViewCountUpdate, articleId]);

  return { viewCount };
}

export default useArticleView;
