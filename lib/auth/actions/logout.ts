'use server';

/**
 * 退出登录操作
 * @module lib/auth/actions/logout
 * @description 用户退出登录
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { AuthResult } from './types';

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
