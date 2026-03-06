'use server';

import { queryFeedbackFromNotion } from '@/lib/notion';
import { getCurrentUser } from './auth';
import type { FeedbackQueryResult } from '@/types/feedback';

/**
 * 获取当前用户的反馈列表
 * 已登录用户按 userId 查询，未登录用户按 trackingIds 查询
 *
 * @param trackingIds 追踪ID数组（未登录用户使用）
 * @returns 反馈列表
 */
export async function getFeedbacksByTrackingIds(trackingIds: string[]): Promise<FeedbackQueryResult> {
  try {
    {/* 获取当前用户信息 */}
    const { userId } = await getCurrentUser();

    {/* 已登录用户：按 userId 查询 */}
    if (userId) {
      const feedbacks = await queryFeedbackFromNotion({ userId });
      return {
        success: true,
        data: feedbacks,
      };
    }

    {/* 未登录用户：按 trackingIds 查询 */}
    if (!trackingIds || trackingIds.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const feedbacks = await queryFeedbackFromNotion({ trackingIds });

    return {
      success: true,
      data: feedbacks,
    };
  } catch (error) {
    console.error('获取反馈列表失败:', error);
    return {
      success: false,
      error: '获取反馈列表失败',
      data: [],
    };
  }
}

/**
 * 获取公告列表
 *
 * @returns 公告列表
 */
export async function getAnnouncements() {
  try {
    return {
      success: true,
      data: [],
    };
  } catch (error) {
    console.error('获取公告列表失败:', error);
    return {
      success: false,
      error: '获取公告列表失败',
    };
  }
}

/**
 * 获取统计信息
 *
 * @returns 统计信息
 */
export async function getFeedbackStatistics() {
  try {
    {/* 获取当前用户信息，后续统计需要用到 */}
    await getCurrentUser();

    {/* TODO: 从 Notion 查询统计数据 */}
    return {
      success: true,
      data: {
        total: 0,
        resolved: 0,
        adopted: 0,
      },
    };
  } catch (error) {
    console.error('获取统计信息失败:', error);
    return {
      success: false,
      error: '获取统计信息失败',
    };
  }
}

/**
 * 获取常见问题
 *
 * @returns 常见问题列表
 */
export async function getFAQs() {
  try {
    return {
      success: true,
      data: [],
    };
  } catch (error) {
    console.error('获取常见问题失败:', error);
    return {
      success: false,
      error: '获取常见问题失败',
    };
  }
}
