'use client';

import { Lock } from '@/components/icons';

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 联系方式输入组件
 * 邮箱/手机号输入，带隐私提示
 *
 * @param value 当前输入值
 * @param onChange 值变化回调
 */
export default function ContactInput({ value, onChange }: ContactInputProps) {
  return (
    <div>
      <label htmlFor="contactEmail" className="block text-sm font-medium text-xf-dark mb-2">
        联系方式（可选）
      </label>
      <input
        type="email"
        id="contactEmail"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary focus:shadow-glow transition-all"
        placeholder="邮箱 / 手机号"
      />
      <p className="text-xs text-xf-primary mt-2 flex items-center gap-1">
        <Lock className="w-3 h-3" />
        仅用于跟进反馈
      </p>
    </div>
  );
}
