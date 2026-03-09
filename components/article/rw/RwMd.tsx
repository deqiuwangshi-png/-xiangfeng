'use client';

/**
 * 打赏弹窗组件
 *
 * @module components/article/rw/RwMd
 * @description 文章打赏功能弹窗
 */

import { useState } from 'react';
import { X, Sparkles, Coins, Megaphone } from '@/components/icons';
import type { User } from '@supabase/supabase-js';
import { TabBtn } from './TabBtn';
import { PtRw } from './PtRw';
import { AdRw } from './AdRw';

/**
 * 打赏方式类型
 */
type RwType = 'points' | 'ad';

/**
 * RwMd Props 接口
 */
interface RwMdProps {
  /** 关闭回调 */
  onClose: () => void;
  /** 当前用户 */
  currentUser: User | null;
}

/**
 * 打赏弹窗组件
 *
 * @param {RwMdProps} props - 组件属性
 * @returns {JSX.Element} 打赏弹窗
 */
export function RwMd({ onClose, currentUser }: RwMdProps) {
  const [activeTab, setActiveTab] = useState<RwType>('points');

  /**
   * 检查用户登录状态
   *
   * @returns {boolean} 是否已登录
   */
  const checkAuth = () => {
    if (!currentUser) {
      alert('请先登录');
      return false;
    }
    return true;
  };

  /**
   * 处理打赏
   *
   * @param {RwType} type - 打赏类型
   */
  const handleReward = (type: RwType) => {
    if (!checkAuth()) return;
    {/* TODO: 实现具体打赏逻辑 */}
    console.log('打赏类型:', type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 text-xf-medium hover:text-xf-dark transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-xf-primary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-xf-dark">鼓励作者</h3>
          <p className="text-sm text-xf-medium mt-1">您的支持是作者创作的动力</p>
        </div>

        {/* 打赏方式选项卡 */}
        <div className="flex gap-2 mb-6 p-1 bg-xf-bg rounded-xl">
          <TabBtn
            active={activeTab === 'points'}
            onClick={() => setActiveTab('points')}
            icon={<Coins className="w-4 h-4" />}
            label="积分"
          />
          <TabBtn
            active={activeTab === 'ad'}
            onClick={() => setActiveTab('ad')}
            icon={<Megaphone className="w-4 h-4" />}
            label="广告"
          />
        </div>

        {/* 打赏内容区域 */}
        <div className="min-h-[200px]">
          {activeTab === 'points' && (
            <PtRw onReward={() => handleReward('points')} />
          )}
          {activeTab === 'ad' && (
            <AdRw onReward={() => handleReward('ad')} />
          )}
        </div>
      </div>
    </div>
  );
}
