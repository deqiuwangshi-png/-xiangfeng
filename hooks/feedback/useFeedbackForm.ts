'use client';

import { useState, useCallback, useMemo } from 'react';
import { submitFeedback, uploadFeedbackFiles } from '@/lib/feedback/actions';
import type { FeedbackType, UploadedFile } from '@/types/user/feedback';

interface UseFeedbackFormOptions {
  onSubmitSuccess: (trackingId: string) => void;
}

interface UseFeedbackFormReturn {
  selectedType: FeedbackType | null;
  setSelectedType: (type: FeedbackType | null) => void;
  description: string;
  setDescription: (value: string) => void;
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
  const [description, setDescription] = useState('');
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
    if (!description.trim()) {
      return '请填写详细描述';
    }
    return null;
  }, [selectedType, description]);

  /**
   * 重置表单
   */
  const resetForm = useCallback(() => {
    setSelectedType(null);
    setDescription('');
    setUploadedFiles([]);
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
   * @returns 上传结果对象，包含成功token列表和失败文件列表
   */
  const uploadPendingFiles = useCallback(async (): Promise<{
    successfulTokens: string[];
    failedFiles: { id: string; name: string; error?: string }[];
  }> => {
    const pendingFiles = uploadedFiles.filter((f) => f.status === 'pending');

    if (pendingFiles.length === 0) {
      return { successfulTokens: [], failedFiles: [] };
    }

    // 将所有待上传文件标记为上传中
    pendingFiles.forEach((file) => {
      updateFileStatus(file.id, { status: 'uploading' });
    });

    const uploadResults = await uploadFeedbackFiles(pendingFiles);

    const successfulTokens: string[] = [];
    const failedFiles: { id: string; name: string; error?: string }[] = [];

    uploadResults.forEach((result) => {
      const file = pendingFiles.find((f) => f.id === result.fileId);
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
        failedFiles.push({
          id: result.fileId,
          name: file?.file.name || '未知文件',
          error: result.error,
        });
      }
    });

    return { successfulTokens, failedFiles };
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

      // 防止重复提交
      if (isSubmitting) {
        return;
      }

      setSubmitError('');

      const error = validateForm();
      if (error) {
        setSubmitError(error);
        return;
      }

      setIsSubmitting(true);

      try {
        // 先上传所有待上传文件
        const { successfulTokens, failedFiles } = await uploadPendingFiles();

        // 检查是否有文件上传失败（直接使用上传结果，不依赖state快照）
        if (failedFiles.length > 0) {
          setSubmitError(`部分文件上传失败: ${failedFiles.map((f) => f.name).join(', ')}`);
          setIsSubmitting(false);
          return;
        }

        // 提交反馈
        const result = await submitFeedback({
          type: selectedType!,
          description: description.trim(),
          attachments: successfulTokens.length > 0 ? successfulTokens : undefined,
        });

        if (result.success && result.trackingId) {
          onSubmitSuccess(result.trackingId);
          resetForm();
        } else {
          setSubmitError(result.error || '提交失败，请稍后重试');
        }
      } catch {
        setSubmitError('提交失败，请稍后重试');
      } finally {
        setIsSubmitting(false);
      }
    },
    // 警告说明：React Hook useCallback 的依赖数组中包含 'uploadedFiles'，
    // 但 'uploadedFiles' 在 useCallback 内部并没有被直接使用，而是通过 setUploadedFiles 的函数式更新来访问。
    // 这会导致不必要的重新创建 handleSubmit 函数，因为 uploadedFiles 每次变化都会触发 useCallback 更新。
    // 
    // 实际上，uploadPendingFiles 已经通过它自己的 useCallback 依赖了 uploadedFiles，
    // 所以 handleSubmit 只需要依赖 uploadPendingFiles 即可，不需要再单独依赖 uploadedFiles。
    // 当前这种写法虽然功能正确，但会导致性能优化失效。
    //
    // 解决方案：从依赖数组中移除 'uploadedFiles'，因为 uploadPendingFiles 已经封装了对 uploadedFiles 的依赖
    [
      isSubmitting,
      validateForm,
      uploadPendingFiles,
      // uploadedFiles, // 已移除：uploadPendingFiles 已经依赖了 uploadedFiles
      selectedType,
      description,
      onSubmitSuccess,
      resetForm,
    ]
  );

  // 使用useMemo缓存返回值，避免不必要重新渲染
  return useMemo(
    () => ({
      selectedType,
      setSelectedType,
      description,
      setDescription,
      uploadedFiles,
      setUploadedFiles,
      isSubmitting,
      submitError,
      handleSubmit,
    }),
    [
      selectedType,
      description,
      uploadedFiles,
      isSubmitting,
      submitError,
      handleSubmit,
    ]
  );
}
