/**
 * HTML 处理工具函数
 *
 * 提供 HTML 内容的解析和提取功能
 *
 * @module html
 */

/**
 * 从 HTML 中提取纯文本
 *
 * 移除所有 HTML 标签，只保留文本内容
 *
 * @param html - HTML 字符串
 * @returns 纯文本字符串
 *
 * @example
 * ```typescript
 * const text = extractTextFromHtml('<p>Hello <b>World</b></p>');
 * // 返回: 'Hello World'
 * ```
 */
export function extractTextFromHtml(html: string): string {
  if (!html) return ''

  // 移除 HTML 标签
  const text = html.replace(/<[^>]*>/g, '')

  // 解码 HTML 实体
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')

  // 移除多余空白
  return decoded.trim().replace(/\s+/g, ' ')
}

/**
 * 生成文章摘要
 *
 * 从 HTML 内容中提取纯文本，并截取指定长度
 *
 * @param content - HTML 内容
 * @param maxLength - 最大长度（默认 100）
 * @returns 摘要文本
 *
 * @example
 * ```typescript
 * const summary = generateSummary('<p>这是一篇很长的文章...</p>', 50);
 * // 返回: '这是一篇很长的文章...'
 * ```
 */
export function generateSummary(content: string, maxLength: number = 100): string {
  const text = extractTextFromHtml(content)

  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength) + '...'
}
