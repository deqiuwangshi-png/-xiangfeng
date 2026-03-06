'use client';

import { Check } from 'lucide-react';

interface SuccessModalProps {
  trackingId: string;
  onClose: () => void;
  onViewMyFeedback: () => void;
}

export default function SuccessModal({ trackingId, onClose, onViewMyFeedback }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 transform transition-all scale-95 opacity-0 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-linear-gradient(to right, xf-success, #4ade80) rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-serif font-bold text-xf-dark mb-2">
            反馈提交成功！
          </h3>
          <p className="text-xf-primary">
            感谢您帮助我们改进产品。我们已收到您的反馈，并将尽快处理。
          </p>
        </div>
        <div className="bg-xf-light/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-xf-dark">反馈ID</span>
            <span className="font-mono font-bold text-xf-accent">{trackingId}</span>
          </div>
          <p className="text-xs text-xf-primary">
            您可以使用此ID在&quot;我的反馈记录&quot;中跟踪处理进展。
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-xf-bg/60 text-xf-primary font-medium rounded-xl hover:bg-xf-light transition-all"
          >
            返回继续反馈
          </button>
          <button
            onClick={onViewMyFeedback}
            className="flex-1 py-3 bg-linear-gradient(to right, xf-primary, xf-accent) hover:bg-linear-gradient(to right, xf-accent, xf-primary) text-white font-medium rounded-xl transition-all"
          >
            查看我的反馈
          </button>
        </div>
      </div>
    </div>
  );
}
