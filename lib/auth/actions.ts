'use server';

/**
 * 认证相关 Server Actions
 * @module lib/auth/actions
 * @description 处理登录、注册、密码重置等认证操作
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { checkServerRateLimit, resetServerRateLimit } from '@/lib/security/rateLimitServer';
import { LOGIN_ERRORS, REGISTER_ERRORS } from './errorMessages';

/**
 * 基础结果接口
 */
interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * 登录输入验证
 */
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

/**
 * 用户登录
 * @param formData 表单数据
 * @returns 登录结果
 */
export async function login(formData: FormData): Promise<AuthResult & { redirectTo?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string || '/home';

  // 输入验证
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || '输入无效' };
  }

  // 服务端限流检查
  const rateLimit = checkServerRateLimit(email);
  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
    return { success: false, error: `尝试次数过多，请 ${minutes} 分钟后再试` };
  }

  try {
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        return { success: false, error: LOGIN_ERRORS.INVALID_CREDENTIALS };
      }
      return { success: false, error: signInError.message };
    }

    // 登录成功，重置限流
    resetServerRateLimit(email);
    revalidatePath('/', 'layout');

    return { success: true, redirectTo };
  } catch (err) {
    console.error('登录失败:', err);
    return { success: false, error: '登录失败，请稍后重试' };
  }
}

/**
 * 注册输入验证
 */
const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8位'),
  username: z.string().min(2, '用户名至少需要2位').max(20, '用户名最多20位'),
});

/**
 * 用户注册
 * @param formData 表单数据
 * @returns 注册结果
 */
export async function register(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  const validation = registerSchema.safeParse({ email, password, username });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || '输入无效' };
  }

  // 注册限流（更严格）
  const rateLimit = checkServerRateLimit(`register:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { success: false, error: '注册尝试次数过多，请1小时后再试' };
  }

  try {
    const supabase = await createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        return { success: false, error: REGISTER_ERRORS.EMAIL_ALREADY_REGISTERED };
      }
      return { success: false, error: signUpError.message };
    }

    return { success: true, message: '注册成功，请检查邮箱完成验证' };
  } catch (err) {
    console.error('注册失败:', err);
    return { success: false, error: '注册失败，请稍后重试' };
  }
}

/**
 * 忘记密码
 * @param formData 表单数据
 * @returns 发送结果
 */
export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return { success: false, error: '请输入有效的邮箱地址' };
  }

  // 限流：每小时最多3次
  const rateLimit = checkServerRateLimit(`forgot:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { success: false, error: '发送次数过多，请1小时后再试' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: '重置密码邮件已发送，请检查邮箱' };
  } catch (err) {
    console.error('发送重置邮件失败:', err);
    return { success: false, error: '发送失败，请稍后重试' };
  }
}

/**
 * 重置密码
 * @param formData 表单数据
 * @returns 重置结果
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password.length < 8) {
    return { success: false, error: '密码至少需要8位' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: '两次输入的密码不一致' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.message.includes('Session expired')) {
        return { success: false, error: '链接已过期，请重新申请' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, message: '密码重置成功，请使用新密码登录' };
  } catch (err) {
    console.error('重置密码失败:', err);
    return { success: false, error: '重置失败，请稍后重试' };
  }
}

/**
 * 退出登录
 * @returns 退出结果
 */
export async function logout(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('退出登录失败:', err);
    return { success: false, error: '退出失败' };
  }
}
