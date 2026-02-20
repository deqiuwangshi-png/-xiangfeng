'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

/**
 * 反馈数据验证模式
 */
const feedbackSchema = z.object({
  type: z.enum(['bug', 'suggestion', 'ui', 'other']),
  title: z.string().min(1, '反馈标题不能为空').max(200, '反馈标题不能超过200字符'),
  description: z.string().min(1, '详细描述不能为空').max(5000, '详细描述不能超过5000字符'),
  contactEmail: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * 提交反馈 Server Action
 * @param feedbackData 反馈数据
 * @returns 提交结果，包含成功状态和追踪ID
 */
export async function submitFeedback(feedbackData: FeedbackInput) {
  try {
    const validatedData = feedbackSchema.parse(feedbackData);

    const trackingId = `FB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`;

    console.log('提交反馈:', {
      trackingId,
      ...validatedData,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/feedback');

    return {
      success: true,
      trackingId,
      message: '反馈提交成功',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '数据验证失败',
        details: error.issues,
      };
    }

    console.error('提交反馈失败:', error);
    return {
      success: false,
      error: '提交失败，请稍后重试',
    };
  }
}

/**
 * 获取用户的反馈列表
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 反馈列表
 */
export async function getUserFeedbacks(userId: string, page: number = 1, pageSize: number = 10) {
  try {
    console.log('获取用户反馈列表:', { userId, page, pageSize });

    return {
      success: true,
      data: [],
      total: 0,
      page,
      pageSize,
    };
  } catch (error) {
    console.error('获取反馈列表失败:', error);
    return {
      success: false,
      error: '获取反馈列表失败',
    };
  }
}

/**
 * 获取热门反馈
 * @param limit 数量限制
 * @returns 热门反馈列表
 */
export async function getHotFeedbacks(limit: number = 10) {
  try {
    console.log('获取热门反馈:', { limit });

    return {
      success: true,
      data: [],
    };
  } catch (error) {
    console.error('获取热门反馈失败:', error);
    return {
      success: false,
      error: '获取热门反馈失败',
    };
  }
}

/**
 * 获取公告列表
 * @returns 公告列表
 */
export async function getAnnouncements() {
  try {
    console.log('获取公告列表');

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
 * @param userId 用户ID
 * @returns 统计信息
 */
export async function getFeedbackStatistics(userId: string) {
  try {
    console.log('获取反馈统计:', { userId });

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
 * @returns 常见问题列表
 */
export async function getFAQs() {
  try {
    console.log('获取常见问题');

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
