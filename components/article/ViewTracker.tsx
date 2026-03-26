'use client';

/**
 * 文章浏览量追踪组件
 *
 * @module components/article/ViewTracker
 * @description 在文章详情页自动统计浏览量
 *
 * @特性
 * - 页面加载后自动统计
 * - 使用 sessionStorage + cookie 双重防刷
 * - 延迟 3 秒后触发，确保真实阅读
 */

import { useArticleView } from '@/hooks/useArticleView';

/**
 * ViewTracker 组件 Props
 */
interface ViewTrackerProps {
  /** 文章ID */
  articleId: string;
}

/**
 * 浏览量追踪组件
 *
 * @param {ViewTrackerProps} props - 组件属性
 * @returns {null} 不渲染任何 UI
 *
 * @description
 * 这是一个逻辑组件，只负责在后台统计浏览量，不渲染任何可见元素。
 * 在文章详情页挂载此组件即可自动启用浏览量统计。
 */
export function ViewTracker({ articleId }: ViewTrackerProps) {
  useArticleView({ articleId });
  return null;
}

export default ViewTracker;
