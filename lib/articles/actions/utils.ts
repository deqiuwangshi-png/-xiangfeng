'use server';

/**
 * 文章模块 Server Actions 工具
 *
 * @module lib/articles/actions/utils
 * @description 只包含 Server Actions 相关函数
 */

import { revalidatePath } from 'next/cache';

/**
 * 异步刷新页面缓存
 *
 * 使用 setImmediate 让 revalidate 在后台执行
 * 不阻塞主流程，提升用户体验
 *
 * @param paths - 需要刷新的路径数组
 */
export async function revalidatePathsAsync(paths: string[]) {
  // 使用 setImmediate 确保在事件循环的下一个 tick 执行
  // 避免阻塞当前请求响应
  setImmediate(() => {
    paths.forEach(path => {
      try {
        revalidatePath(path);
      } catch (error) {
        console.warn(`Failed to revalidate ${path}:`, error);
      }
    });
  });
}
