'use client';

import { Send, Loader2 } from 'lucide-react';

interface SubmitBtnProps {
  isSubmitting: boolean;
  disabled?: boolean;
}

/**
 * 提交按钮组件
 * 显示提交状态，支持加载动画
 *
 * @param isSubmitting 是否正在提交
 * @param disabled 是否禁用
 */
export default function SubmitBtn({ isSubmitting, disabled }: SubmitBtnProps) {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full py-3.5 bg-xf-accent text-white font-medium rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            提交中...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            提交反馈
          </>
        )}
      </button>
    </div>
  );
}
