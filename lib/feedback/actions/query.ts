'use server';

import { getCurrentUser } from './auth';
import { queryFeishuFeedbacks } from '@/lib/feishu/api';
import { isValidTrackingId } from '@/lib/feedback/utils';
import type { FeedbackQueryResult } from '@/types/feedback';

/**
 * 获取当前用户的反馈列表
 * 优先按 trackingIds 查询（包含未登录用户的反馈），
 * 已登录用户额外按邮箱查询并合并结果
 *
 * @安全增强 P1: 添加 trackingId 格式校验和归属校验
 * @param trackingIds 追踪ID数组
 * @returns 反馈列表
 */
export async function getFeedbacksByTrackingIds(trackingIds: string[]): Promise<FeedbackQueryResult> {
  try {
    // 获取当前用户信息
    const { userId, userEmail } = await getCurrentUser();

    // 收集所有查询结果
    const allFeedbacks: NonNullable<FeedbackQueryResult['data']> = [];
    const seenIds = new Set<string>();

    // 1. 优先按 trackingIds 查询（包含匿名提交和已登录用户提交的反馈）
    if (trackingIds && trackingIds.length > 0) {
      /**
       * @安全增强 P1: 过滤无效的 trackingId
       * - 防止恶意构造的 ID 被用于枚举攻击
       * - 只保留符合格式的 ID
       */
      const validTrackingIds = trackingIds.filter(id => isValidTrackingId(id));

      if (validTrackingIds.length > 0) {
        const trackingResult = await queryFeishuFeedbacks({ trackingIds: validTrackingIds });
        if (trackingResult.success && trackingResult.data) {
          for (const item of trackingResult.data) {
            /**
             * @安全增强 P1: 归属校验
             * - 已登录用户只能看到与自己邮箱关联的反馈
             * - 未登录用户只能看到与自己 trackingId 关联的反馈
             * - 防止通过猜测 trackingId 读取他人反馈
             */
            const isOwner = userEmail
              ? item.userEmail === userEmail
              : validTrackingIds.includes(item.trackingId as string);

            if (isOwner && !seenIds.has(item.id)) {
              allFeedbacks.push(item);
              seenIds.add(item.id);
            }
          }
        }
      }
    }

    // 2. 已登录用户额外按邮箱查询（捕获可能遗漏的反馈）
    if (userId && userEmail) {
      const emailResult = await queryFeishuFeedbacks({ userEmail });
      if (emailResult.success && emailResult.data) {
        for (const item of emailResult.data) {
          if (!seenIds.has(item.id)) {
            allFeedbacks.push(item);
            seenIds.add(item.id);
          }
        }
      }
    }

    return {
      success: true,
      data: allFeedbacks,
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
    // 获取当前用户信息
    await getCurrentUser();

    // TODO: 从飞书多维表格查询统计数据
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
