import { cookies } from 'next/headers';
import { getAuthCookieConfig, getFeatureCookieConfig } from './cookieConfig';
import type { CookieOptions } from '@supabase/ssr';

/**
 * Cookie 管理工具类
 * 提供统一的 Cookie 操作方法
 */
export class CookieManager {
  /**
   * 设置认证相关 Cookie
   * 
   * @param name - Cookie 名称
   * @param value - Cookie 值
   * @param options - 额外的 Cookie 选项（会与默认配置合并）
   */
  static async setAuthCookie(
    name: string,
    value: string,
    options: Partial<CookieOptions> = {}
  ): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      ...getAuthCookieConfig(),
      ...options,
    });
  }

  /**
   * 设置功能相关 Cookie
   * 
   * @param name - Cookie 名称
   * @param value - Cookie 值
   * @param maxAge - 过期时间（秒），默认 24小时
   * @param options - 额外的 Cookie 选项（会与默认配置合并）
   */
  static async setFeatureCookie(
    name: string,
    value: string,
    maxAge: number = 24 * 60 * 60,
    options: Partial<CookieOptions> = {}
  ): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      ...getFeatureCookieConfig(maxAge),
      ...options,
    });
  }

  /**
   * 获取 Cookie 值
   * 
   * @param name - Cookie 名称
   * @returns Cookie 值，如果不存在则返回 undefined
   */
  static async getCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  }

  /**
   * 删除 Cookie
   * 
   * @param name - Cookie 名称
   */
  static async deleteCookie(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  }

  /**
   * 批量设置 Cookie
   * 
   * @param cookiesToSet - 要设置的 Cookie 数组
   * @param isAuthCookie - 是否为认证相关 Cookie
   */
  static async setAllCookies(
    cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>,
    isAuthCookie: boolean = true
  ): Promise<void> {
    const cookieStore = await cookies();
    
    cookiesToSet.forEach(({ name, value, options }) => {
      if (isAuthCookie) {
        cookieStore.set(name, value, {
          ...getAuthCookieConfig(),
          ...options,
        });
      } else {
        cookieStore.set(name, value, {
          ...getFeatureCookieConfig(),
          ...options,
        });
      }
    });
  }

  /**
   * 获取所有 Cookie
   * 
   * @returns Cookie 数组
   */
  static async getAllCookies(): Promise<Array<{ name: string; value: string }>> {
    const cookieStore = await cookies();
    return cookieStore.getAll();
  }
}
