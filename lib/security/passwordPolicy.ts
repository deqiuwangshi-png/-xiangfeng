/**
 * 密码策略 - 极简版
 */

import type { PasswordValidationResult } from '@/types';

/**
 * 验证密码强度
 */
export function validatePassword(password: string): PasswordValidationResult {
  const requirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const score = Math.min(100, metRequirements * 20);

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 80) strength = 'strong';
  else if (score >= 40) strength = 'medium';

  return {
    valid: requirements.minLength,
    score,
    strength,
    requirements,
  };
}

export type { PasswordValidationResult };
