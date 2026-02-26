/**
 * 行动卡片组件
 * 用于显示鼓励和禁止行为，带有图标和特殊样式
 */

import { ReactNode } from 'react';
import { CheckCircle, XCircle, Check, X } from 'lucide-react';

interface ActionItem {
  text: string;
}

interface ActionCardProps {
  encouragementItems: ActionItem[];
  prohibitionItems: ActionItem[];
}

export function ActionCard({ encouragementItems, prohibitionItems }: ActionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-bold text-xf-success mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            鼓励行为
          </h4>
          <ul className="space-y-2">
            {encouragementItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-xf-success mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-xf-warning mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            禁止行为
          </h4>
          <ul className="space-y-2">
            {prohibitionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <X className="w-4 h-4 text-xf-warning mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}