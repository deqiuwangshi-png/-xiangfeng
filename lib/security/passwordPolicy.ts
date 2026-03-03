/**
 * 密码安全策略模块
 * 
 * 用于验证密码复杂度，防止弱密码
 */

export interface PasswordValidationResult {
  valid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

// 默认密码策略
const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// 常见弱密码黑名单
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', 'letmein', 'dragon', '111111', 'baseball',
  'iloveyou', 'trustno1', 'sunshine', 'princess', 'admin',
  'welcome', 'shadow', 'ashley', 'football', 'jesus',
  'michael', 'ninja', 'mustang', 'password1', '123456789',
];

/**
 * 验证密码复杂度
 * 
 * @param password - 待验证的密码
 * @param policy - 密码策略（可选，使用默认策略）
 * @returns 验证结果
 * 
 * @example
 * const result = validatePassword('MyP@ssw0rd');
 * if (!result.valid) {
 *   console.log(result.message);
 * }
 */
export function validatePassword(
  password: string,
  policy: Partial<PasswordPolicy> = {}
): PasswordValidationResult {
  const opts = { ...DEFAULT_POLICY, ...policy };
  
  const requirements = {
    minLength: password.length >= opts.minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  
  // 检查长度
  if (password.length < opts.minLength) {
    return {
      valid: false,
      message: `密码长度至少为 ${opts.minLength} 位`,
      strength: 'weak',
      requirements,
    };
  }
  
  if (password.length > opts.maxLength) {
    return {
      valid: false,
      message: `密码长度不能超过 ${opts.maxLength} 位`,
      strength: 'weak',
      requirements,
    };
  }
  
  // 检查复杂度要求
  const missingRequirements: string[] = [];
  
  if (opts.requireUppercase && !requirements.hasUppercase) {
    missingRequirements.push('大写字母');
  }
  if (opts.requireLowercase && !requirements.hasLowercase) {
    missingRequirements.push('小写字母');
  }
  if (opts.requireNumber && !requirements.hasNumber) {
    missingRequirements.push('数字');
  }
  if (opts.requireSpecialChar && !requirements.hasSpecialChar) {
    missingRequirements.push('特殊字符');
  }
  
  if (missingRequirements.length > 0) {
    return {
      valid: false,
      message: `密码需包含：${missingRequirements.join('、')}`,
      strength: 'weak',
      requirements,
    };
  }
  
  // 检查常见弱密码
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return {
      valid: false,
      message: '该密码过于常见，请更换更复杂的密码',
      strength: 'weak',
      requirements,
    };
  }
  
  // 计算密码强度
  const strength = calculateStrength(password, requirements);
  
  return {
    valid: true,
    message: '密码强度符合要求',
    strength,
    requirements,
  };
}

/**
 * 计算密码强度
 */
function calculateStrength(
  password: string,
  requirements: PasswordValidationResult['requirements']
): 'weak' | 'medium' | 'strong' {
  let score = 0;
  
  // 长度得分
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  
  // 复杂度得分
  if (requirements.hasUppercase) score += 1;
  if (requirements.hasLowercase) score += 1;
  if (requirements.hasNumber) score += 1;
  if (requirements.hasSpecialChar) score += 1;
  
  // 额外长度奖励
  if (password.length >= 16) score += 1;
  
  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}

/**
 * 生成随机强密码
 * 
 * @param length - 密码长度（默认16位）
 * @returns 生成的密码
 */
export function generateStrongPassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const all = uppercase + lowercase + numbers + special;
  let password = '';
  
  // 确保至少包含每种类型的字符
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // 填充剩余长度
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // 打乱顺序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
