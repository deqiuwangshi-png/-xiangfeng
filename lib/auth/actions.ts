'use server';

/**
 * 认证相关 Server Actions
 * @module lib/auth/actions
 * @description 登录、注册、退出、密码管理等认证操作
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/seo';
import { checkServerRateLimit, resetServerRateLimit, getClientIp } from '@/lib/security/rateLimitServer';
import {
  LOGIN_MESSAGES,
  REGISTER_MESSAGES,
  RESET_PASSWORD_MESSAGES,
  CHANGE_PASSWORD_MESSAGES,
  LOGOUT_MESSAGES,
  COMMON_ERRORS,
  mapSupabaseError,
} from '@/lib/messages';
import { sanitizeRedirect } from './utils/redir';
import { isAllowedEmail, validatePasswordMatch } from './utils/helpers';
import { getCurrentUser, recordLoginHistory } from './server';
import { activateAccount } from '@/lib/user/deactivateAccount';
import { OAUTH_PROVIDER_CONFIG } from '@/config/navigation';
import type { AuthResult } from '@/types';
import type { OAuthProvider, OAuthLoginResult } from '@/types/auth/oauth';

// ==================== 登录 ====================

const loginSchema = z.object({
  email: z.email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

export async function login(formData: FormData): Promise<AuthResult & { redirectTo?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectRaw = formData.get('redirectTo');
  const redirectTo = sanitizeRedirect(redirectRaw, '/home');

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || LOGIN_MESSAGES.DEFAULT_ERROR };
  }

  const headersList = await headers();
  const clientIp = getClientIp(headersList);
  const rateLimitKey = `${clientIp}:${email}`;
  const rateLimit = await checkServerRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
    return { success: false, error: LOGIN_MESSAGES.RATE_LIMITED.replace('{minutes}', String(minutes)) };
  }

  try {
    const supabase = await createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      const friendlyError = mapSupabaseError(signInError.message, 'login');
      return { success: false, error: friendlyError || LOGIN_MESSAGES.INVALID_CREDENTIALS };
    }

    if (signInData.user) {
      activateAccount(signInData.user.id).catch(err => console.error('激活账户失败:', err));
      recordLoginHistory(signInData.user.id, 'password', true, false).catch(err => console.error('记录登录历史失败:', err));
    }

    await resetServerRateLimit(rateLimitKey);
    revalidatePath('/', 'layout');
    return { success: true, redirectTo };
  } catch (err) {
    console.error('登录失败:', err);
    return { success: false, error: LOGIN_MESSAGES.DEFAULT_ERROR };
  }
}

// ==================== 注册 ====================

const USERNAME_REGEX = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

const registerSchema = z.object({
  email: z.email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8位'),
  username: z.string()
    .min(2, '用户名至少需要2位')
    .max(20, '用户名最多20位')
    .regex(USERNAME_REGEX, '用户名只能包含字母、数字、下划线和中文'),
});

export async function register(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  const validation = registerSchema.safeParse({ email, password, username });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || REGISTER_MESSAGES.DEFAULT_ERROR };
  }

  if (!isAllowedEmail(email)) {
    return { success: false, error: REGISTER_MESSAGES.EMAIL_NOT_ALLOWED };
  }

  const supabase = await createClient();
  const { data: existingUser } = await supabase.from('profiles').select('id').eq('username', username).limit(1).maybeSingle();
  if (existingUser) {
    return { success: false, error: REGISTER_MESSAGES.USERNAME_ALREADY_TAKEN };
  }

  const rateLimit = await checkServerRateLimit(`register:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) {
    return { success: false, error: REGISTER_MESSAGES.RATE_LIMITED };
  }

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username }, emailRedirectTo: `${siteUrl}/login` },
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        return { success: false, error: REGISTER_MESSAGES.EMAIL_ALREADY_REGISTERED };
      }
      return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
    }

    if (!signUpData.user) {
      return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
    }

    return { success: true, message: REGISTER_MESSAGES.SUCCESS };
  } catch (err) {
    console.error('注册失败:', err);
    return { success: false, error: REGISTER_MESSAGES.DEFAULT_ERROR };
  }
}

// ==================== 退出登录 ====================

export async function logout(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) return { success: false, error: error.message };
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('退出登录失败:', err);
    return { success: false, error: LOGOUT_MESSAGES.DEFAULT_ERROR };
  }
}

// ==================== 忘记密码 ====================

export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;

  if (!email || !z.email().safeParse(email).success) {
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }

  const headersList = await headers();
  const clientIp = getClientIp(headersList);

  const ipRateLimit = await checkServerRateLimit(`forgot:ip:${clientIp}`, { maxAttempts: 5, windowMs: 60 * 60 * 1000 });
  if (!ipRateLimit.allowed) return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };

  const emailRateLimit = await checkServerRateLimit(`forgot:email:${email}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
  if (!emailRateLimit.allowed) return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/reset-password` });
    if (error) console.error('发送重置邮件失败:', error);
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  } catch (err) {
    console.error('发送重置邮件失败:', err);
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }
}

// ==================== 重置密码 ====================

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const validation = validatePasswordMatch(password, confirmPassword);
  if (validation) return validation;

  try {
    const supabase = await createClient();
    const user = await getCurrentUser();
    if (!user) return { success: false, error: RESET_PASSWORD_MESSAGES.LINK_EXPIRED };

    const rateLimit = await checkServerRateLimit(`reset:${user.id}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
    if (!rateLimit.allowed) return { success: false, error: RESET_PASSWORD_MESSAGES.RATE_LIMITED };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: mapSupabaseError(error.message, 'reset-password') };

    return { success: true, message: RESET_PASSWORD_MESSAGES.SUCCESS };
  } catch (err) {
    console.error('重置密码失败:', err);
    return { success: false, error: RESET_PASSWORD_MESSAGES.DEFAULT_ERROR };
  }
}

// ==================== 修改密码 ====================

export async function changePassword(formData: FormData): Promise<AuthResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const validation = validatePasswordMatch(password, confirmPassword);
  if (validation) return validation;

  try {
    const supabase = await createClient();
    const user = await getCurrentUser();
    if (!user) return { success: false, error: CHANGE_PASSWORD_MESSAGES.NOT_AUTHENTICATED };

    const rateLimit = await checkServerRateLimit(`change:${user.id}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) return { success: false, error: CHANGE_PASSWORD_MESSAGES.RATE_LIMITED };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: error.message };

    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    return { success: true, message: CHANGE_PASSWORD_MESSAGES.SUCCESS };
  } catch (err) {
    console.error('修改密码失败:', err);
    return { success: false, error: CHANGE_PASSWORD_MESSAGES.DEFAULT_ERROR };
  }
}

// ==================== OAuth 登录 ====================

export async function oauthLogin(provider: OAuthProvider, redirectTo: string = '/home'): Promise<OAuthLoginResult> {
  const config = OAUTH_PROVIDER_CONFIG[provider];
  if (!config || !config.enabled) {
    return { success: false, error: LOGIN_MESSAGES.OAUTH_NOT_ENABLED.replace('{provider}', config?.name || provider) };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}` },
    });

    if (error || !data.url) {
      return { success: false, error: LOGIN_MESSAGES.OAUTH_ERROR };
    }
    return { success: true, url: data.url };
  } catch (err) {
    console.error('OAuth login exception:', err);
    return { success: false, error: COMMON_ERRORS.UNKNOWN_ERROR };
  }
}

export async function getOAuthProvidersStatus(): Promise<Record<OAuthProvider, { name: string; enabled: boolean }>> {
  return { ...OAUTH_PROVIDER_CONFIG };
}
