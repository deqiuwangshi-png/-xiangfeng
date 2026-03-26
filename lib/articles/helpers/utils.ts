/**
 * 文章模块共享工具函数
 *
 * @module lib/articles/helpers/utils
 * @description 提供文章操作相关的纯工具函数（非 Server Action）
 */

/**
 * 验证UUID格式
 *
 * @param id - 待验证的ID
 * @returns 是否为有效的UUID
 *
 * @example
 * if (!isValidUUID(articleId)) {
 *   throw new Error('无效的文章ID');
 * }
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * 安全错误处理
 *
 * 记录详细错误到服务端日志，但返回通用错误信息给客户端
 * 防止泄露数据库细节等敏感信息
 *
 * @param context - 错误上下文（函数名/模块名）
 * @param error - 原始错误对象
 * @throws 始终抛出通用错误信息
 *
 * @example
 * try {
 *   // 数据库操作
 * } catch (err) {
 *   return handleQueryError('getArticles', err);
 * }
 */
export function handleQueryError(context: string, error: unknown): never {
  const errorCode = error instanceof Error ? error.name : 'UNKNOWN';
  console.error(`[${context}] 查询失败`, { errorCode });
  throw new Error('获取数据失败，请稍后重试');
}
