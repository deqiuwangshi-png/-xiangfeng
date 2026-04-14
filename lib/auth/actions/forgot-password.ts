'use server';

/**
 * 忘记密码操作
 * @module lib/auth/actions/forgot-password
 * @description 发送密码重置邮件
 *
 * @安全修复 S-05: 多层限流防止邮箱轰炸攻击
 * - IP 级别限流：防止单一 IP 发送大量请求
 * - 邮箱级别限流：防止对单一邮箱的频繁请求
 * - 组合限流：防止攻击者轮换邮箱绕过限制
 */

import { z } from 'zod';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/seo';
import { checkServerRateLimit, getClientIp } from '@/lib/security/rateLimitServer';
import { RESET_PASSWORD_MESSAGES } from '@/lib/messages';
import type { AuthResult } from '@/types';

/**
 * 忘记密码
 * @param formData 表单数据
 * @returns 发送结果
 *
 * @安全特性
 * - 三层限流策略防止邮箱轰炸攻击
 * - 统一返回成功消息防止邮箱枚举
 * - 所有限流检查通过后才发送邮件
 */
export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;

  // 统一返回成功消息，防止邮箱枚举攻击
  if (!email || !z.email().safeParse(email).success) {
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }

  // 获取客户端 IP
  const headersList = await headers();
  const clientIp = getClientIp(headersList);

  /**
   * 第一层限流：IP 级别（最严格）
   * @安全说明
   * - 限制单个 IP 的总请求次数
   * - 防止攻击者使用大量不同邮箱进行轰炸
   * - 窗口期 1 小时，最多 5 次请求
   */
  const ipRateLimit = await checkServerRateLimit(`forgot:ip:${clientIp}`, {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 小时
  });
  if (!ipRateLimit.allowed) {
    // 记录可疑行为但不暴露限流信息
    console.warn(`[安全警告] IP ${clientIp} 触发忘记密码限流`);
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }

  /**
   * 第二层限流：邮箱级别
   * @安全说明
   * - 限制对单个邮箱的请求次数
   * - 防止对特定用户的骚扰
   * - 窗口期 1 小时，最多 3 次请求
   */
  const emailRateLimit = await checkServerRateLimit(`forgot:email:${email}`, {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 小时
  });
  if (!emailRateLimit.allowed) {
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }

  /**
   * 第三层限流：IP + 邮箱组合
   * @安全说明
   * - 防止攻击者轮换邮箱时仍针对同一 IP 限流
   * - 作为额外的安全层
   */
  const comboRateLimit = await checkServerRateLimit(`forgot:combo:${clientIp}:${email}`, {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 小时
  });
  if (!comboRateLimit.allowed) {
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    if (error) {
      console.error('发送重置邮件失败:', error);
    }

    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  } catch (err) {
    console.error('发送重置邮件失败:', err);
    return { success: true, message: RESET_PASSWORD_MESSAGES.EMAIL_SENT };
  }
}
