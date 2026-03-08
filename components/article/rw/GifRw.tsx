'use client';

/**
 * 礼物打赏面板
 *
 * @module components/article/rw/GifRw
 * @description 礼物打赏选项面板
 */

import { useState } from 'react';

/**
 * 礼物配置
 */
const gifts = [
  { id: 'flower', name: '鲜花', icon: '🌸', price: 10 },
  { id: 'coffee', name: '咖啡', icon: '☕', price: 50 },
  { id: 'crown', name: '皇冠', icon: '👑', price: 100 },
  { id: 'rocket', name: '火箭', icon: '🚀', price: 500 },
];

/**
 * GifRw Props 接口
 */
interface GifRwProps {
  /** 打赏回调 */
  onReward: () => void;
}

/**
 * 礼物打赏面板
 *
 * @param {GifRwProps} props - 组件属性
 * @returns {JSX.Element} 礼物打赏面板
 */
export function GifRw({ onReward }: GifRwProps) {
  const [selectedGift, setSelectedGift] = useState(gifts[0].id);
  const currentGift = gifts.find((g) => g.id === selectedGift);

  return (
    <div className="space-y-4">
      <p className="text-sm text-xf-medium text-center">选择虚拟礼物</p>
      <div className="grid grid-cols-4 gap-3">
        {gifts.map((gift) => (
          <button
            key={gift.id}
            className={`py-3 px-2 rounded-xl border-2 transition-all ${
              selectedGift === gift.id
                ? 'border-xf-primary bg-xf-surface/30'
                : 'border-xf-bg hover:border-xf-primary/50'
            }`}
            onClick={() => setSelectedGift(gift.id)}
          >
            <div className="text-2xl mb-1">{gift.icon}</div>
            <div className="text-xs font-medium text-xf-dark">{gift.name}</div>
            <div className="text-xs text-xf-primary">{gift.price}积分</div>
          </button>
        ))}
      </div>
      <button
        className="w-full py-3 bg-xf-primary text-white rounded-xl font-medium hover:bg-xf-accent transition-colors"
        onClick={onReward}
      >
        赠送 {currentGift?.name}
      </button>
    </div>
  );
}
