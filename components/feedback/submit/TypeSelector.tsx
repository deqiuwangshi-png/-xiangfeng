'use client';

import { Bug, Lightbulb, Palette, HelpCircle } from '@/components/icons';
import type { FeedbackType } from '@/types/user/feedback';

interface TypeSelectorProps {
  selectedType: FeedbackType | null;
  onChange: (type: FeedbackType | null) => void;
}

const feedbackTypes = [
  { id: 'bug' as FeedbackType, icon: Bug, label: '问题反馈', color: 'text-xf-error' },
  { id: 'suggestion' as FeedbackType, icon: Lightbulb, label: '功能建议', color: 'text-xf-warning' },
  { id: 'ui' as FeedbackType, icon: Palette, label: '界面优化', color: 'text-xf-info' },
  { id: 'other' as FeedbackType, icon: HelpCircle, label: '其他反馈', color: 'text-xf-primary' },
];

/**
 * 反馈类型选择器组件
 * 轻量级Radio Group横向排列，选中显示莫兰迪紫边框
 *
 * @param selectedType 当前选中的类型
 * @param onChange 类型变化回调
 */
export default function TypeSelector({ selectedType, onChange }: TypeSelectorProps) {
  /**
   * 处理类型点击
   * 点击已选中类型则取消选择，否则选中该类型
   *
   * @param typeId 点击的类型ID
   */
  const handleTypeClick = (typeId: FeedbackType) => {
    onChange(selectedType === typeId ? null : typeId);
  };

  return (
    <div className="mb-2">
      <div className="flex flex-wrap gap-2">
        {feedbackTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeClick(type.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-sm ${
              selectedType === type.id
                ? 'border-2 border-[#9b8aa6] bg-[#f5f3f7]'
                : 'border border-dashed border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <type.icon className={`w-4 h-4 ${selectedType === type.id ? type.color : 'text-gray-400'}`} />
            <span className={selectedType === type.id ? 'text-xf-dark font-medium' : 'text-gray-500'}>
              {type.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
