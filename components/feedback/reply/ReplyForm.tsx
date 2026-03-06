'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface FeedbackReplyFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  isSubmitting: boolean;
  submitError: string;
}

/**
 * 反馈评论表单组件
 * 用于提交新评论
 *
 * @param onSubmit 提交回调
 * @param isSubmitting 是否提交中
 * @param submitError 提交错误信息
 */
export default function FeedbackReplyForm({
  onSubmit,
  isSubmitting,
  submitError,
}: FeedbackReplyFormProps) {
  const [content, setContent] = useState('');

  /**
   * 处理提交
   */
  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    const success = await onSubmit(content);
    if (success) {
      setContent('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-xf-bg/40">
      <h5 className="text-sm font-medium text-xf-dark mb-2">添加回复</h5>
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入您的回复..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary resize-none text-sm"
          disabled={isSubmitting}
        />
        {submitError && (
          <p className="text-sm text-xf-error">{submitError}</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-xf-accent text-white text-sm font-medium rounded-lg hover:bg-xf-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                发送回复
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
