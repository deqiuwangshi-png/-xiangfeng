'use client';

/**
 * 广告打赏面板
 *
 * @module components/article/rw/AdRw
 * @description 广告打赏选项面板
 */

import { Megaphone } from '@/components/icons';

/**
 * AdRw Props 接口
 */
interface AdRwProps {
  /** 打赏回调 */
  onReward: () => void;
}

/**
 * 广告打赏面板
 *
 * @param {AdRwProps} props - 组件属性
 * @returns {JSX.Element} 广告打赏面板
 */
export function AdRw({ onReward }: AdRwProps) {
  return (
    <div className="space-y-4">
      <div className="bg-xf-info rounded-xl p-6 text-white text-center">
        <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-80" />
        <h4 className="text-lg font-bold mb-2">观看广告支持作者</h4>
        <p className="text-sm opacity-80">观看 15 秒广告，作者将获得平台奖励</p>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-xf-medium">
        <span>预计作者收益:</span>
        <span className="text-xf-primary font-bold">+5 积分</span>
      </div>
      <button
        className="w-full py-3 bg-xf-info text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        onClick={onReward}
      >
        观看广告
      </button>
    </div>
  );
}
