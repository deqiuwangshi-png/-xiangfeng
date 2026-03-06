'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { submitFeedbackToNotion } from '@/lib/notion';
import { generateTrackingId } from '../utils';
import { getCurrentUser } from './auth';
import type { FeedbackInput, FeedbackSubmitResult } from '@/types/feedback';

/**
 * 反馈数据验证模式
 */
const feedbackSchema = z.object({
  type: z.enum(['bug', 'suggestion', 'ui', 'other']),
  title: z.string().min(1, '反馈标题不能为空').max(200, '反馈标题不能超过200字符'),
  description: z.string().min(1, '详细描述不能为空').max(5000, '详细描述不能超过5000字符'),
  contactEmail: z.email('邮箱格式不正确').optional().or(z.literal('')),
  attachments: z.array(z.url('附件链接格式不正确')).optional(),
});

/**
 * 提交反馈 Server Action
 * 将反馈数据写入 Notion 数据库
 *
 * @param feedbackData 反馈数据
 * @returns 提交结果，包含成功状态和追踪ID
 */
export async function submitFeedback(feedbackData: FeedbackInput): Promise<FeedbackSubmitResult> {
  try {
    {/* 验证输入数据 */}
    const validatedData = feedbackSchema.parse(feedbackData);

    {/* 生成追踪ID */}
    const trackingId = generateTrackingId();

    {/* 获取当前用户信息 */}
    const { userId, userEmail } = await getCurrentUser();

    {/* 提交到 Notion */}
    await submitFeedbackToNotion({
      type: validatedData.type,
      title: validatedData.title,
      description: validatedData.description,
      contactEmail: validatedData.contactEmail || undefined,
      userId,
      userEmail,
      attachments: validatedData.attachments,
      trackingId,
    });

    {/* 刷新缓存 */}
    revalidatePath('/feedback');

    return {
      success: true,
      trackingId,
    };
  } catch (error) {
    {/* Zod 验证错误处理 */}
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '数据验证失败: ' + error.issues.map((issue) => issue.message).join(', '),
      };
    }

    {/* Notion API 错误处理 */}
    if (error instanceof Error && error.message.includes('Notion')) {
      console.error('Notion API 错误:', error);
      return {
        success: false,
        error: '反馈存储失败，请稍后重试',
      };
    }

    {/* 其他错误处理 */}
    console.error('提交反馈失败:', error);
    return {
      success: false,
      error: '提交失败，请稍后重试',
    };
  }
}
