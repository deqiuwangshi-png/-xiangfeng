/**
 * HTML 处理工具函数
 *
 * 提供 HTML 内容的解析、净化和提取功能
 *
 * @module html
 */

{/* 允许的标签白名单 */}
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 'strike', 'del',
  'a', 'img',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span'
]

{/* 允许的属性白名单 */}
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  '*': ['class', 'id']
}

{/* 危险协议黑名单 */}
const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript|file):/i

/**
 * 净化 HTML 内容，防止 XSS 攻击
 *
 * 基于白名单的 HTML 净化，只允许安全的标签和属性
 *
 * @param html - 原始 HTML 字符串
 * @returns 净化后的安全 HTML 字符串
 *
 * @example
 * ```typescript
 * const safe = sanitizeHtml('<p>Hello</p><script>alert(1)</script>');
 * // 返回: '<p>Hello</p>'
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  {/* 移除注释 */}
  let sanitized = html.replace(/<!--[\s\S]*?-->/g, '')

  {/* 移除 script 标签及其内容 */}
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  sanitized = sanitized.replace(/<script[^>]*\/>/gi, '')

  {/* 移除 style 标签及其内容 */}
  sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  {/* 移除事件处理器属性 */}
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '')

  {/* 处理标签 - 只允许白名单标签 */}
  sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase()

    {/* 不允许的标签直接移除 */}
    if (!ALLOWED_TAGS.includes(lowerTagName)) {
      return ''
    }

    {/* 处理允许的标签的属性 */}
    const attrRegex = /\s+([a-zA-Z-:]+)\s*=\s*"([^"]*)"/g
    const attrs: string[] = []
    let attrMatch
    const allowedAttrs = ALLOWED_ATTRIBUTES[lowerTagName] || []
    const globalAttrs = ALLOWED_ATTRIBUTES['*'] || []

    while ((attrMatch = attrRegex.exec(match)) !== null) {
      const attrName = attrMatch[1].toLowerCase()
      const attrValue = attrMatch[3]

      {/* 检查属性是否在白名单中 */}
      if (allowedAttrs.includes(attrName) || globalAttrs.includes(attrName)) {
        {/* 检查 href/src 属性是否包含危险协议 */}
        if ((attrName === 'href' || attrName === 'src') && DANGEROUS_PROTOCOLS.test(attrValue)) {
          continue
        }
        attrs.push(`${attrName}="${attrValue.replace(/"/g, '&quot;')}"`)
      }
    }

    const isClosingTag = match.startsWith('</')
    if (isClosingTag) {
      return `</${lowerTagName}>`
    }

    return attrs.length > 0
      ? `<${lowerTagName} ${attrs.join(' ')}>`
      : `<${lowerTagName}>`
  })

  {/* 移除空标签 */}
  sanitized = sanitized.replace(/<[^>]+>\s*<\/[^>]+>/g, '')

  return sanitized.trim()
}

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

  {/* 先净化 HTML，移除危险内容 */}
  const sanitized = sanitizeHtml(html)

  {/* 移除 HTML 标签 */}
  const text = sanitized.replace(/<[^>]*>/g, '')

  {/* 解码 HTML 实体 */}
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')

  {/* 移除多余空白 */}
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
