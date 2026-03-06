'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { submitFeedbackToNotion, queryFeedbackFromNotion } from '@/lib/notion';
import { createClient } from '@/lib/supabase/server';

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

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * 生成追踪ID
 * 格式: FB-年月日-随机3位数字
 *
 * @returns 追踪ID字符串
 */
function generateTrackingId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 900 + 100);
  return `FB-${year}${month}${day}-${random}`;
}

/**
 * 获取当前登录用户信息
 *
 * @returns 用户ID和邮箱，如果未登录则返回空对象
 */
async function getCurrentUser(): Promise<{ userId?: string; userEmail?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return {
        userId: user.id,
        userEmail: user.email,
      };
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }

  return {};
}

/**
 * 提交反馈 Server Action
 * 将反馈数据写入 Notion 数据库
 *
 * @param feedbackData 反馈数据
 * @returns 提交结果，包含成功状态和追踪ID
 */
export async function submitFeedback(feedbackData: FeedbackInput) {
  try {
    {/* 验证输入数据 */}
    const validatedData = feedbackSchema.parse(feedbackData);

    {/* 生成追踪ID */}
    const trackingId = generateTrackingId();

    {/* 获取当前用户信息 */}
    const { userId, userEmail } = await getCurrentUser();

    {/* 提交到 Notion */}
    const notionPage = await submitFeedbackToNotion({
      type: validatedData.type,
      title: validatedData.title,
      description: validatedData.description,
      contactEmail: validatedData.contactEmail || undefined,
      userId,
      userEmail,
      attachments: validatedData.attachments,
      trackingId,
    });

    console.log('反馈已提交到 Notion:', {
      trackingId,
      pageId: notionPage.id,
      userId,
      createdTime: notionPage.created_time,
    });

    {/* 刷新缓存 */}
    revalidatePath('/feedback');

    return {
      success: true,
      trackingId,
      message: '反馈提交成功',
      notionPageId: notionPage.id,
    };
  } catch (error) {
    {/* Zod 验证错误处理 */}
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '数据验证失败',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }

    {/* Notion API 错误处理 */}
    if (error instanceof Error && error.message.includes('Notion')) {
      console.error('Notion API 错误:', error);
      return {
        success: false,
        error: '反馈存储失败，请稍后重试',
        details: error.message,
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

/**
 * 上传附件到 Supabase Storage
 * 返回公开访问URL
 *
 * @param formData 包含文件的 FormData
 * @returns 上传结果，包含文件URL
 */
export async function uploadFeedbackAttachment(formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        error: '未找到文件',
      };
    }

    {/* 验证文件大小 (10MB) */}
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: '文件大小超过10MB限制',
      };
    }

    {/* 验证文件类型 */}
    const allowedTypes = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    const isAllowedType = allowedTypes.some((type) =>
      file.type.startsWith(type) || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')
    );

    if (!isAllowedType) {
      return {
        success: false,
        error: '不支持的文件类型',
      };
    }

    {/* 获取当前用户 */}
    const { userId } = await getCurrentUser();
    const folderPrefix = userId ? `user_${userId}` : 'anonymous';

    {/* 生成唯一文件名 */}
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${folderPrefix}/${timestamp}_${randomString}.${fileExtension}`;

    {/* 上传到 Supabase Storage */}
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from('feedback-attachments')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('文件上传失败:', error);
      return {
        success: false,
        error: '文件上传失败: ' + error.message,
      };
    }

    {/* 获取公开URL */}
    const { data: { publicUrl } } = supabase.storage
      .from('feedback-attachments')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('上传附件失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    };
  }
}

/**
 * 获取当前用户的反馈列表
 * 已登录用户按 userId 查询，未登录用户按 trackingIds 查询
 *
 * @param trackingIds 追踪ID数组（未登录用户使用）
 * @returns 反馈列表
 */
export async function getFeedbacksByTrackingIds(trackingIds: string[]) {
  try {
    {/* 获取当前用户信息 */}
    const { userId } = await getCurrentUser();

    {/* 已登录用户：按 userId 查询 */}
    if (userId) {
      console.log('查询用户反馈列表（已登录）:', { userId });
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

    console.log('查询反馈列表（未登录）:', { trackingIds });
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
 * 获取热门反馈
 *
 * @param limit 数量限制
 * @returns 热门反馈列表
 */
export async function getHotFeedbacks(limit: number = 10) {
  try {
    console.log('获取热门反馈:', { limit });

    {/* TODO: 从 Notion 查询热门反馈 */}
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
 *
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
 *
 * @returns 统计信息
 */
export async function getFeedbackStatistics() {
  try {
    const { userId } = await getCurrentUser();

    console.log('获取反馈统计:', { userId });

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

/**
 * 获取反馈的评论列表
 *
 * @param pageId Notion 页面ID
 * @returns 评论列表
 */
export async function getFeedbackReplies(pageId: string) {
  try {
    const { getFeedbackComments } = await import('@/lib/notion');
    const comments = await getFeedbackComments(pageId);

    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error('获取评论失败:', error);
    return {
      success: false,
      error: '获取评论失败',
      data: [],
    };
  }
}

/**
 * 提交评论到反馈
 *
 * @param pageId Notion 页面ID
 * @param content 评论内容
 * @returns 提交结果
 */
export async function submitReply(pageId: string, content: string) {
  try {
    {/* 验证输入 */}
    if (!content.trim()) {
      return {
        success: false,
        error: '评论内容不能为空',
      };
    }

    if (content.length > 2000) {
      return {
        success: false,
        error: '评论内容不能超过2000字符',
      };
    }

    const { addFeedbackComment } = await import('@/lib/notion');
    const comment = await addFeedbackComment(pageId, content.trim());

    console.log('评论已提交:', {
      pageId,
      commentId: comment.id,
      author: comment.author,
    });

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error('提交评论失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '提交评论失败',
    };
  }
}
