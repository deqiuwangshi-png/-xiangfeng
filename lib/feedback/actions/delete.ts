'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from './auth';

/**
 * 从 Supabase Storage 删除文件
 *
 * @param fileUrl 文件的公开访问URL
 * @param feedbackId 关联的反馈ID（用于权限校验）
 * @returns 删除结果
 *
 * @统一认证 2026-03-30
 * - 使用统一认证入口 getCurrentUser
 * - 验证当前用户是否登录
 * - 验证文件是否属于当前用户的反馈
 * - 防止越权删除他人文件
 */
export async function deleteFeedbackAttachment(
  fileUrl: string,
  feedbackId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // 获取当前用户 - 使用统一认证入口
    const { userId } = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: '用户未登录',
      };
    }

    // 验证反馈归属：检查该反馈是否属于当前用户
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .select('user_id, attachments')
      .eq('id', feedbackId)
      .single();

    if (feedbackError || !feedbackData) {
      return {
        success: false,
        error: '反馈不存在',
      };
    }

    // 验证当前用户是否为反馈所有者
    if (feedbackData.user_id !== userId) {
      return {
        success: false,
        error: '无权删除此附件',
      };
    }

    // 验证文件URL是否在该反馈的附件列表中
    const attachments = feedbackData.attachments || [];
    const isAttachmentExist = attachments.some((url: string) => url.includes(fileUrl) || fileUrl.includes(url));

    if (!isAttachmentExist) {
      return {
        success: false,
        error: '附件不属于该反馈',
      };
    }

    {/* 从URL中提取文件路径 */}
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(/\/feedback-attachments\/(.*)/);

    if (!pathMatch || !pathMatch[1]) {
      return {
        success: false,
        error: '无效的文件URL',
      };
    }

    const filePath = decodeURIComponent(pathMatch[1]);

    {/* 删除文件 */}
    const { error } = await supabase.storage
      .from('feedback-attachments')
      .remove([filePath]);

    if (error) {
      console.error('删除文件失败:', error);
      return {
        success: false,
        error: '删除文件失败: ' + error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('删除附件失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '删除失败',
    };
  }
}
