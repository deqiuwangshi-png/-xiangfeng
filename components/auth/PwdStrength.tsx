'use client';

import { type PasswordValidationResult } from '@/lib/security/passwordPolicy';
import { JSX } from 'react';

/**
 * 密码强度指示器组件属性接口
 * @interface PwdStrengthProps
 */
interface PwdStrengthProps {
  /** 密码验证结果 */
  validation: PasswordValidationResult | null;
  /** 强度颜色类名 */
  strengthColor: string;
}

/**
 * 密码强度文字映射
 */
const STRENGTH_LABELS: Record<string, string> = {
  strong: '强',
  medium: '中',
  weak: '弱',
};

/**
 * 密码强度指示器组件
 * @description 显示密码强度等级和验证提示
 * @param {PwdStrengthProps} props - 组件属性
 * @returns {JSX.Element | null} 密码强度指示器
 * @example
 * <PwdStrength
 *   validation={passwordValidation}
 *   strengthColor="text-green-600"
 * />
 */
export function PwdStrength({
  validation,
  strengthColor,
}: PwdStrengthProps): JSX.Element | null {
  if (!validation) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1">
      {/* 强度标签 */}
      <div className="flex items-center gap-2 text-xs">
        <span className={strengthColor}>
          密码强度: {STRENGTH_LABELS[validation.strength] || '未知'}
        </span>
      </div>

      {/* 验证失败提示 */}
      {!validation.valid && validation.message && (
        <p className="text-red-500 text-xs">{validation.message}</p>
      )}
    </div>
  );
}
