'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from './auth';

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
