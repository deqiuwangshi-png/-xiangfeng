'use client';

import { useState, useCallback } from 'react';
import { getFeedbackReplies, submitReply } from '@/lib/feedback/actions';
import type { Reply } from '@/types/user/feedback';

interface UseFeedbackRepliesOptions {
  pageId: string;
}

interface UseFeedbackRepliesReturn {
  replies: Reply[];
  isLoading: boolean;
  isSubmitting: boolean;
  submitError: string;
  loadReplies: () => Promise<void>;
  submitNewReply: (content: string) => Promise<boolean>;
}

/**
 * 反馈评论管理 Hook
 * 管理评论列表的加载和提交
 *
 * @param options 配置选项
 * @returns 评论状态和操作函数
 */
export function useFeedbackReplies({ pageId }: UseFeedbackRepliesOptions): UseFeedbackRepliesReturn {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * 加载评论列表
   */
  const loadReplies = useCallback(async () => {
    if (!pageId) return;

    setIsLoading(true);
    try {
      const result = await getFeedbackReplies(pageId);
      if (result.success && result.data) {
        setReplies(result.data);
      }
    } catch {
      // 加载失败时保持空状态
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  /**
   * 提交新评论
   *
   * @param content 评论内容
   * @returns 是否提交成功
   */
  const submitNewReply = useCallback(async (content: string): Promise<boolean> => {
    if (!pageId || !content.trim()) return false;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const result = await submitReply(pageId, content);
      if (result.success && result.data) {
        const newReply = result.data;
        setReplies((prev) => [...prev, newReply]);
        return true;
      } else {
        setSubmitError(result.error || '提交失败');
        return false;
      }
    } catch {
      setSubmitError('提交失败，请稍后重试');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [pageId]);

  return {
    replies,
    isLoading,
    isSubmitting,
    submitError,
    loadReplies,
    submitNewReply,
  };
}
