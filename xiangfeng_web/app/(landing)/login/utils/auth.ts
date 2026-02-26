import { FormEvent } from 'react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string;
}

/**
 * 处理登录表单提交
 * @param {FormEvent} event - 表单提交事件
 * @param {Function} onSubmit - 表单提交回调函数
 * @returns {void}
 */
export function handleLoginSubmit(event: FormEvent<HTMLFormElement>, onSubmit: (data: LoginFormData) => void): void {
  event.preventDefault();
  
  const formData = new FormData(event.currentTarget);
  const data: LoginFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    rememberMe: formData.get('rememberMe') === 'on'
  };
  
  onSubmit(data);
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {object} 验证结果
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 6) {
    return { isValid: false, message: '密码长度至少为6位' };
  }
  
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { isValid: false, message: '密码必须包含字母和数字' };
  }
  
  return { isValid: true, message: '密码强度良好' };
}

/**
 * 处理社交登录
 * @param {string} provider - 社交提供商
 * @returns {Promise<void>}
 */
export async function handleSocialLogin(provider: string): Promise<void> {
  try {
    // 这里可以集成实际的社交登录SDK
    console.log(`正在处理 ${provider} 登录...`);
    
    // 模拟登录过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 重定向到认证页面
    window.location.href = `/auth/${provider}`;
  } catch (error) {
    console.error(`${provider} 登录失败:`, error);
    throw new Error(`${provider} 登录失败，请重试`);
  }
}