'use client';

/**
 * 积分打赏面板
 *
 * @module components/article/rw/PtRw
 * @description 积分打赏选项面板
 */

import { useState } from 'react';

/**
 * PtRw Props 接口
 */
interface PtRwProps {
  /** 打赏回调 */
  onReward: () => void;
}

/**
 * 积分打赏面板
 *
 * @param {PtRwProps} props - 组件属性
 * @returns {JSX.Element} 积分打赏面板
 */
export function PtRw({ onReward }: PtRwProps) {
  const pointsOptions = [10, 50, 100, 500];
  const [selectedPoints, setSelectedPoints] = useState(10);

  return (
    <div className="space-y-4">
      <p className="text-sm text-xf-medium text-center">选择打赏积分数量</p>
      <div className="grid grid-cols-4 gap-3">
        {pointsOptions.map((points) => (
          <button
            key={points}
            className={`py-3 px-2 rounded-xl border-2 transition-all ${
              selectedPoints === points
                ? 'border-xf-primary bg-xf-surface/30 text-xf-primary'
                : 'border-xf-bg hover:border-xf-primary/50'
            }`}
            onClick={() => setSelectedPoints(points)}
          >
            <div className="text-lg font-bold">{points}</div>
            <div className="text-xs text-xf-medium">积分</div>
          </button>
        ))}
      </div>
      <button
        className="w-full py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-accent transition-colors"
        onClick={onReward}
      >
        打赏 {selectedPoints} 积分
      </button>
    </div>
  );
}
