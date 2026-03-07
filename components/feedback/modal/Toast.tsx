'use client';

import { useEffect, useState } from 'react';
import { Check, X } from '@/components/icons';
import { Copy } from 'lucide-react';

interface ToastProps {
  message: string;
  trackingId?: string;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast 轻提示组件
 * 用于显示操作成功/失败的轻量提示，自动消失
 *
 * @param message 提示消息
 * @param trackingId 追踪ID（可选）
 * @param onClose 关闭回调
 * @param duration 自动关闭时长（毫秒），默认 5000ms
 */
export default function Toast({ message, trackingId, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    {/* 入场动画 */}
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    {/* 自动关闭 */}
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  /**
   * 复制追踪ID到剪贴板
   */
  const handleCopy = async () => {
    if (!trackingId) return;

    try {
      await navigator.clipboard.writeText(trackingId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      {/* 复制失败静默处理 */}
    }
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-sm w-full transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white border border-xf-success/30 rounded-xl shadow-elevated p-4 flex items-start gap-3">
        {/* 成功图标 */}
        <div className="shrink-0 w-8 h-8 bg-xf-success/10 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-xf-success" />
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-xf-dark">{message}</p>

          {/* 追踪ID */}
          {trackingId && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-xf-primary">追踪ID:</span>
              <code className="text-xs font-mono bg-xf-light px-2 py-0.5 rounded text-xf-accent">
                {trackingId}
              </code>
              <button
                onClick={handleCopy}
                className="text-xs text-xf-primary hover:text-xf-accent flex items-center gap-1 transition-colors"
                title="复制追踪ID"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    复制
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 text-xf-primary hover:text-xf-dark transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
