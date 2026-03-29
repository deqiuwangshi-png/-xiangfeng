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
 * 密码强度颜色映射（用于进度条）
 */
const STRENGTH_COLORS: Record<string, string> = {
  strong: 'bg-green-500',
  medium: 'bg-yellow-500',
  weak: 'bg-red-500',
};

/**
 * 密码强度进度映射
 */
const STRENGTH_PROGRESS: Record<string, number> = {
  strong: 100,
  medium: 60,
  weak: 30,
};

/**
 * 密码强度指示器组件
 * @description 显示密码强度等级和验证提示，包含可视化进度条
 * @param {PwdStrengthProps} props - 组件属性
 * @returns {JSX.Element | null} 密码强度指示器
 */
export function PwdStrength({
  validation,
  strengthColor,
}: PwdStrengthProps): JSX.Element | null {
  if (!validation) {
    return null;
  }

  const progress = STRENGTH_PROGRESS[validation.strength] || 0;
  const progressColor = STRENGTH_COLORS[validation.strength] || 'bg-gray-300';

  return (
    <div className="mt-2 space-y-2">
      {/* 强度进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${progressColor}`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`密码强度: ${STRENGTH_LABELS[validation.strength] || '未知'}`}
        />
      </div>

      {/* 强度标签 */}
      <div className="flex items-center justify-between text-xs">
        <span className={strengthColor}>
          密码强度: {STRENGTH_LABELS[validation.strength] || '未知'}
        </span>
        <span className="text-xf-primary">
          得分: {validation.score}/4
        </span>
      </div>

      {/* 验证要求清单 */}
      {validation.requirements && (
        <ul className="text-xs space-y-1 mt-2">
          <li className={`flex items-center gap-1 ${validation.requirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{validation.requirements.minLength ? '✓' : '○'}</span>
            <span>至少8个字符</span>
          </li>
          <li className={`flex items-center gap-1 ${validation.requirements.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{validation.requirements.hasUppercase ? '✓' : '○'}</span>
            <span>包含大写字母</span>
          </li>
          <li className={`flex items-center gap-1 ${validation.requirements.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{validation.requirements.hasLowercase ? '✓' : '○'}</span>
            <span>包含小写字母</span>
          </li>
          <li className={`flex items-center gap-1 ${validation.requirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{validation.requirements.hasNumber ? '✓' : '○'}</span>
            <span>包含数字</span>
          </li>
          <li className={`flex items-center gap-1 ${validation.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{validation.requirements.hasSpecialChar ? '✓' : '○'}</span>
            <span>包含特殊字符</span>
          </li>
        </ul>
      )}

      {/* 验证失败提示 */}
      {!validation.valid && validation.message && (
        <p className="text-red-500 text-xs">{validation.message}</p>
      )}
    </div>
  );
}
