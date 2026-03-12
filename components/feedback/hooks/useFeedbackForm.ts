'use client';

import { useState, useCallback, useMemo } from 'react';
import { submitFeedback, uploadFeedbackFiles } from '@/lib/feedback/actions';
import type { FeedbackType, UploadedFile } from '@/types/feedback';

interface UseFeedbackFormOptions {
  onSubmitSuccess: (trackingId: string) => void;
}

interface UseFeedbackFormReturn {
  selectedType: FeedbackType | null;
  setSelectedType: (type: FeedbackType | null) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[] | ((prevFiles: UploadedFile[]) => UploadedFile[])) => void;
  isSubmitting: boolean;
  submitError: string;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * 反馈表单逻辑Hook
 * 管理表单状态、验证和提交逻辑
 * 文件上传延迟到提交时进行，避免资源浪费
 *
 * @param onSubmitSuccess 提交成功回调
 * @returns 表单状态和操作方法
 */
export function useFeedbackForm({ onSubmitSuccess }: UseFeedbackFormOptions): UseFeedbackFormReturn {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * 验证表单数据
   *
   * @returns 错误信息，验证通过返回null
   */
  const validateForm = useCallback((): string | null => {
    if (!selectedType) {
      return '请选择反馈类型';
    }
    if (!title.trim() || !description.trim()) {
      return '请填写标题和详细描述';
    }
    return null;
  }, [selectedType, title, description]);

  /**
   * 重置表单
   */
  const resetForm = useCallback(() => {
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setContactEmail('');
    setUploadedFiles([]);
    setShowAdvanced(false);
    setSubmitError('');
  }, []);

  /**
   * 更新文件状态
   *
   * @param fileId 文件ID
   * @param updates 更新内容
   */
  const updateFileStatus = useCallback((fileId: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((item) => (item.id === fileId ? { ...item, ...updates } : item))
    );
  }, []);

  /**
   * 上传所有待上传文件
   *
   * @returns 上传成功的fileToken数组
   */
  const uploadPendingFiles = useCallback(async (): Promise<string[]> => {
    const pendingFiles = uploadedFiles.filter((f) => f.status === 'pending');

    if (pendingFiles.length === 0) {
      return [];
    }

    // 将所有待上传文件标记为上传中
    pendingFiles.forEach((file) => {
      updateFileStatus(file.id, { status: 'uploading' });
    });

    const uploadResults = await uploadFeedbackFiles(pendingFiles);

    const successfulTokens: string[] = [];

    uploadResults.forEach((result) => {
      if (result.success && result.fileToken) {
        updateFileStatus(result.fileId, {
          status: 'uploaded',
          fileToken: result.fileToken,
        });
        successfulTokens.push(result.fileToken);
      } else {
        updateFileStatus(result.fileId, {
          status: 'error',
          error: result.error || '上传失败',
        });
      }
    });

    return successfulTokens;
  }, [uploadedFiles, updateFileStatus]);

  /**
   * 处理表单提交
   * 先上传文件，再提交反馈
   *
   * @param e 表单提交事件
   */
  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError('');

      const error = validateForm();
      if (error) {
        setSubmitError(error);
        return;
      }

      setIsSubmitting(true);

      try {
        // 先上传所有待上传文件
        const attachmentTokens = await uploadPendingFiles();

        // 检查是否有文件上传失败
        const failedFiles = uploadedFiles.filter((f) => f.status === 'error');
        if (failedFiles.length > 0) {
          setSubmitError(`部分文件上传失败: ${failedFiles.map((f) => f.file.name).join(', ')}`);
          setIsSubmitting(false);
          return;
        }

        // 提交反馈
        const result = await submitFeedback({
          type: selectedType!,
          title: title.trim(),
          description: description.trim(),
          contactEmail: contactEmail.trim() || undefined,
          attachments: attachmentTokens.length > 0 ? attachmentTokens : undefined,
        });

        if (result.success && result.trackingId) {
          onSubmitSuccess(result.trackingId);
          resetForm();
        } else {
          setSubmitError(result.error || '提交失败，请稍后重试');
        }
      } catch (error) {
        console.error('提交反馈失败:', error);
        setSubmitError('提交失败，请稍后重试');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateForm,
      uploadPendingFiles,
      uploadedFiles,
      selectedType,
      title,
      description,
      contactEmail,
      onSubmitSuccess,
      resetForm,
    ]
  );

  // 使用useMemo缓存返回值，避免不必要重新渲染
  return useMemo(
    () => ({
      selectedType,
      setSelectedType,
      title,
      setTitle,
      description,
      setDescription,
      contactEmail,
      setContactEmail,
      showAdvanced,
      setShowAdvanced,
      uploadedFiles,
      setUploadedFiles,
      isSubmitting,
      submitError,
      handleSubmit,
    }),
    [
      selectedType,
      title,
      description,
      contactEmail,
      showAdvanced,
      uploadedFiles,
      isSubmitting,
      submitError,
      handleSubmit,
    ]
  );
}
