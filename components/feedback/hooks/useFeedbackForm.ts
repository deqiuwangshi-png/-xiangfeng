'use client';

import { useState, useCallback, useMemo } from 'react';
import { submitFeedback } from '@/lib/feedback/actions';
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
    const uploadingFiles = uploadedFiles.filter((f) => f.isUploading);
    if (uploadingFiles.length > 0) {
      return '请等待附件上传完成';
    }
    return null;
  }, [selectedType, title, description, uploadedFiles]);

  /**
   * 重置表单
   */
  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setContactEmail('');
    setUploadedFiles([]);
    setShowAdvanced(false);
  }, []);

  /**
   * 处理表单提交
   *
   * @param e 表单提交事件
   */
  const handleSubmit = useCallback(async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const attachmentTokens = uploadedFiles
        .filter((f) => f.fileToken)
        .map((f) => f.fileToken!);

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
  }, [validateForm, selectedType, title, description, contactEmail, uploadedFiles, onSubmitSuccess, resetForm]);

  {/* 使用useMemo缓存返回值，避免不必要重新渲染 */}
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
