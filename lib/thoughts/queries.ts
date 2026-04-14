/**
 * 思考轨迹查询模块
 * @module lib/thoughts/queries
 * @description 从 articles 和 comments 表聚合用户思考热力图数据
 *
 * @数据源
 * - articles 表：发布文章（深度3）
 * - comments 表：发表评论（深度1）
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取用户信息
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/server';

/**
 * 热力图数据项
 * @interface HeatMapData
 * @property {string} date - 日期 (YYYY-MM-DD)
 * @property {number} count - 思考深度 (1-5)
 * @property {string} [domain] - 领域标签
 * @property {string} [insight] - 灵感摘要
 */
export interface HeatMapData {
  date: string;
  count: number;
  domain?: string;
  insight?: string;
}

/**
 * 获取用户思考热力图数据
 * 从 articles 和 comments 表聚合数据，无需额外记录
 *
 * @function fetchThoughtHeatMap
 * @param {string} [userId] - 目标用户ID（不传则查当前登录用户）
 * @param {number} [days=180] - 查询最近天数（默认180天）
 * @returns {Promise<HeatMapData[]>} 热力图数据数组
 *
 * @数据映射规则
 * - 发布文章：深度3（深思），领域取自文章首个标签
 * - 发表评论：深度1（浅思），领域固定为"互动"
 * - 同一天有多条记录时，取最高深度
 *
 * @权限检查
 * - 查询他人数据时，检查用户资料可见性
 * - private 用户不返回数据
 *
 * @统一认证 2026-03-30
 * - 使用 lib/auth/user.ts 的统一入口获取当前用户
 */
export async function fetchThoughtHeatMap(
  userId?: string,
  days: number = 180
): Promise<HeatMapData[]> {
  const supabase = await createClient();

  // 确定目标用户ID
  let targetUserId = userId;
  if (!targetUserId) {
    // 使用统一认证入口获取当前用户
    const user = await getCurrentUser();
    if (!user) return [];
    targetUserId = user.id;
  } else {
    // 查询他人数据时，检查资料可见性
    const { data: profile } = await supabase
      .from('profiles')
      .select('visibility')
      .eq('id', targetUserId)
      .single();

    if (profile?.visibility === 'private') {
      return [];
    }
  }

  // 计算起始日期
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString();

  // 并行查询文章和评论数据
  const [articlesResult, commentsResult] = await Promise.all([
    // 查询已发布文章（深度3）
    supabase
      .from('articles')
      .select('created_at, title, tags')
      .eq('author_id', targetUserId)
      .eq('status', 'published')
      .gte('created_at', startDateStr),

    // 查询活跃评论（深度1）
    supabase
      .from('comments')
      .select('created_at, content')
      .eq('user_id', targetUserId)
      .eq('status', 'active')
      .gte('created_at', startDateStr),
  ]);

  const { data: articles } = articlesResult;
  const { data: comments } = commentsResult;

  // 按日期聚合数据（每天取最高深度）
  const dailyMap = new Map<string, HeatMapData>();

  // 处理文章数据：深度3
  articles?.forEach((article) => {
    const date = article.created_at.split('T')[0];
    const existing = dailyMap.get(date);

    // 从标签提取领域，无标签则默认为"创作"
    const domain = article.tags?.[0] || '创作';

    // 只保留更高深度的记录
    if (!existing || existing.count < 3) {
      dailyMap.set(date, {
        date,
        count: 3,
        domain,
        insight: article.title.slice(0, 50),
      });
    }
  });

  // 处理评论数据：深度1
  comments?.forEach((comment) => {
    const date = comment.created_at.split('T')[0];

    // 如果当天已有更高深度记录，跳过
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        count: 1,
        domain: '互动',
        insight: comment.content.slice(0, 50),
      });
    }
  });

  // 转换为数组并按日期排序
  return Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

/**
 * 获取思考统计数据
 * 用于热力图顶部统计展示
 *
 * @function fetchThoughtStats
 * @param {string} [userId] - 目标用户ID
 * @param {number} [days=180] - 查询天数
 * @returns {Promise<{deepThoughts: number, sparkMoments: number, domains: number}>} 统计数据
 */
export async function fetchThoughtStats(
  userId?: string,
  days: number = 180
): Promise<{
  deepThoughts: number;
  sparkMoments: number;
  domains: number;
}> {
  const data = await fetchThoughtHeatMap(userId, days);

  // 深度思考：深度>=3（发布文章）
  const deepThoughts = data.filter((item) => item.count >= 3).length;

  // 灵感时刻：深度>=4（预留，当前无此数据源）
  const sparkMoments = data.filter((item) => item.count >= 4).length;

  // 思考维度：不同领域数量
  const domains = new Set(data.map((item) => item.domain).filter(Boolean)).size;

  return {
    deepThoughts,
    sparkMoments,
    domains,
  };
}
