'use server';

/**
 * 文章模块共享工具函数
 *
 * @module lib/articles/actions/utils
 * @description 提供文章操作相关的共享工具函数
 */

import { revalidatePath } from 'next/cache';

/**
 * 异步刷新页面缓存
 *
 * 使用 Promise.resolve().then() 让 revalidate 在后台执行
 * 不阻塞主流程，提升用户体验
 *
 * @param paths - 需要刷新的路径数组
 */
export async function revalidatePathsAsync(paths: string[]) {
  Promise.resolve().then(() => {
    paths.forEach(path => {
      try {
        revalidatePath(path);
      } catch (error) {
        console.warn(`Failed to revalidate ${path}:`, error);
      }
    });
  });
}
