'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * 从 Supabase Storage 删除文件
 *
 * @param fileUrl 文件的公开访问URL
 * @returns 删除结果
 */
export async function deleteFeedbackAttachment(fileUrl: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

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
