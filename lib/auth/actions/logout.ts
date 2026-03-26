'use server';

/**
 * 退出登录操作
 * @module lib/auth/actions/logout
 * @description 用户退出登录，使服务端会话失效防止"幽灵"会话攻击
 *
 * @安全说明
 * - 使用 scope: 'global' 使 Supabase 服务端会话失效
 * - 防止窃取 Cookie 后的未授权访问（即使客户端已登出）
 * - 同时清除本地 Cookie 和服务端会话状态
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { AuthResult } from './types';

/**
 * 退出登录
 * @returns 退出结果
 *
 * @安全特性
 * - scope: 'global' 确保服务端会话被标记为失效
 * - 所有该用户的活跃会话都会被终止
 * - 已窃取的 Cookie 将无法通过服务端验证
 */
export async function logout(): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    /**
     * 使用 global scope 登出
     * - local: 仅清除本地 Cookie（不安全，存在幽灵会话漏洞）
     * - global: 通知 Supabase Auth 服务端使会话失效（推荐）
     */
    const { error } = await supabase.auth.signOut({ scope: 'global' });

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
