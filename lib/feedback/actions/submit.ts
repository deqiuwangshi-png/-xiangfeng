'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createFeishuFeedback } from '@/lib/feishu/api';
import { getCurrentUser } from '@/lib/feedback/actions/auth';
import { generateTrackingId } from '../utils';
import type { FeedbackInput, FeedbackSubmitResult } from '@/types/user/feedback';

/**
 * 反馈数据验证模式
 */
const feedbackSchema = z.object({
  type: z.enum(['bug', 'suggestion', 'ui', 'other']),
  description: z.string().min(1, '详细描述不能为空').max(5000, '详细描述不能超过5000字符'),
  attachments: z.array(z.string().min(1, '附件token不能为空')).max(10, '附件数量不能超过10个').optional(),
});

/**
 * 提交反馈 Server Action
 * 将反馈数据写入飞书多维表格
 *
 * @param feedbackData 反馈数据
 * @returns 提交结果，包含成功状态和追踪ID
 */
export async function submitFeedback(feedbackData: FeedbackInput): Promise<FeedbackSubmitResult> {
  try {
    // 验证输入数据
    const validatedData = feedbackSchema.parse(feedbackData);

    // 获取当前登录用户信息
    const { userId, userEmail } = await getCurrentUser();

    // 生成追踪ID
    const trackingId = generateTrackingId();

    // 提交到飞书多维表格
    const feishuResult = await createFeishuFeedback({
      type: validatedData.type,
      description: validatedData.description,
      userId: userId || undefined,
      userEmail: userEmail || undefined,
      status: 'pending',
      attachments: validatedData.attachments,
      trackingId,
    });

    // 检查飞书提交结果
    if (!feishuResult.success) {
      console.error('飞书提交失败:', feishuResult.error);
      return {
        success: false,
        error: '反馈存储失败，请稍后重试',
      };
    }

    // 刷新缓存
    revalidatePath('/feedback');

    return {
      success: true,
      trackingId,
    };
  } catch (error) {
    // Zod 验证错误处理
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '数据验证失败: ' + error.issues.map((issue) => issue.message).join(', '),
      };
    }

    // 其他错误处理
    console.error('提交反馈失败:', error);
    return {
      success: false,
      error: '提交失败，请稍后重试',
    };
  }
}
