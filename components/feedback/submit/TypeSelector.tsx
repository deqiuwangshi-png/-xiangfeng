'use client';

import { Bug, Lightbulb, Palette, HelpCircle } from 'lucide-react';

type FeedbackType = 'bug' | 'suggestion' | 'ui' | 'other';

interface TypeSelectorProps {
  selectedType: FeedbackType | null;
  onChange: (type: FeedbackType | null) => void;
}

const feedbackTypes = [
  { id: 'bug' as FeedbackType, icon: Bug, label: '问题反馈', desc: '功能异常/错误', color: 'text-xf-error' },
  { id: 'suggestion' as FeedbackType, icon: Lightbulb, label: '功能建议', desc: '新功能/改进', color: 'text-xf-warning' },
  { id: 'ui' as FeedbackType, icon: Palette, label: '界面优化', desc: '视觉/交互', color: 'text-xf-info' },
  { id: 'other' as FeedbackType, icon: HelpCircle, label: '其他反馈', desc: '其他问题', color: 'text-xf-primary' },
];

/**
 * 反馈类型选择器组件
 * 展示4种反馈类型卡片，支持单选/取消选择
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
    <div>
      <label className="block text-sm font-medium text-xf-dark mb-3">
        反馈类型 <span className="text-xf-error">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {feedbackTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeClick(type.id)}
            className={`flex flex-col items-center text-center cursor-pointer transition-all border-2 rounded-xl p-4 pb-2 ${
              selectedType === type.id
                ? 'border-xf-accent shadow-elevated scale-105'
                : 'border-xf-surface/50 bg-xf-light/50'
            }`}
          >
            <type.icon className={`w-6 h-6 mb-2 ${type.color}`} />
            <div className="font-medium text-sm">{type.label}</div>
            <div className="text-[11px] text-xf-primary mt-1 leading-tight">
              {type.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
