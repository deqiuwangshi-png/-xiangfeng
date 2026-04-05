/**
 * JSON 处理工具函数
 *
 * 提供 TipTap JSON 内容的解析和提取功能
 *
 * @module json
 */

/**
 * TipTap JSON 节点类型
 */
export interface TipTapNode {
  type: string
  content?: TipTapNode[]
  text?: string
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  attrs?: Record<string, unknown>
}

/**
 * TipTap JSON 文档类型
 */
export interface TipTapJSON {
  type: 'doc'
  content?: TipTapNode[]
}

/**
 * 从 TipTap JSON 提取纯文本
 *
 * 递归遍历 JSON 结构，提取所有文本节点的内容
 *
 * @param json - TipTap JSON 对象或字符串
 * @returns 纯文本字符串
 *
 * @example
 * ```typescript
 * const json = {
 *   type: 'doc',
 *   content: [
 *     {
 *       type: 'paragraph',
 *       content: [
 *         { type: 'text', text: 'Hello ' },
 *         { type: 'text', text: 'World', marks: [{ type: 'bold' }] }
 *       ]
 *     }
 *   ]
 * }
 * const text = extractTextFromJSON(json)
 * // 返回: 'Hello World'
 * ```
 */
export function extractTextFromJSON(json: TipTapJSON | string): string {
  if (!json) return ''

  try {
    const parsed = typeof json === 'string' ? (JSON.parse(json) as TipTapJSON) : json
    return extractTextFromNode(parsed)
  } catch {
    return ''
  }
}

/**
 * 递归从节点提取文本
 * @param node - TipTap 节点
 * @returns 纯文本
 */
function extractTextFromNode(node: TipTapNode | TipTapJSON): string {
  if (!node) return ''

  // 文本节点
  if ('text' in node && node.text) {
    return node.text
  }

  // 容器节点，递归提取
  if ('content' in node && Array.isArray(node.content)) {
    return node.content.map(child => extractTextFromNode(child)).join('')
  }

  return ''
}

/**
 * 从 TipTap JSON 生成摘要
 *
 * 提取纯文本并截取指定长度
 *
 * @param json - TipTap JSON 对象或字符串
 * @param maxLength - 最大长度（默认 100）
 * @returns 摘要文本
 *
 * @example
 * ```typescript
 * const summary = generateSummaryFromJSON(json, 50)
 * // 返回: '这是一篇很长的文章...'
 * ```
 */
export function generateSummaryFromJSON(json: TipTapJSON | string, maxLength: number = 100): string {
  const text = extractTextFromJSON(json)

  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength) + '...'
}

/**
 * 检查 TipTap JSON 是否为空
 *
 * 检查条件：
 * 1. JSON 是否有效
 * 2. 是否有内容节点
 * 3. 提取的文本是否为空（去除空白后）
 *
 * @param json - TipTap JSON 对象或字符串
 * @returns 是否为空
 *
 * @example
 * ```typescript
 * const empty = { type: 'doc', content: [{ type: 'paragraph' }] }
 * isContentEmpty(empty) // true
 *
 * const withContent = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] }
 * isContentEmpty(withContent) // false
 * ```
 */
export function isContentEmpty(json: TipTapJSON | string): boolean {
  if (!json) return true

  try {
    const parsed = typeof json === 'string' ? (JSON.parse(json) as TipTapJSON) : json

    // 检查是否有内容节点
    if (!parsed.content || parsed.content.length === 0) {
      return true
    }

    // 提取纯文本并检查
    const text = extractTextFromNode(parsed).trim()
    return text.length === 0
  } catch {
    return true
  }
}

/**
 * 计算 TipTap JSON 的文本长度
 *
 * @param json - TipTap JSON 对象或字符串
 * @returns 字符数
 */
export function getContentLength(json: TipTapJSON | string): number {
  return extractTextFromJSON(json).length
}

/**
 * 验证 TipTap JSON 格式
 *
 * @param content - 内容字符串
 * @returns 验证结果
 */
export function validateTipTapJSON(content: string): { valid: boolean; error?: string } {
  if (!content) {
    return { valid: false, error: '内容不能为空' }
  }

  try {
    const parsed = JSON.parse(content) as TipTapJSON

    if (parsed.type !== 'doc') {
      return { valid: false, error: '内容格式错误：缺少 doc 类型' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: '内容格式错误：无效的 JSON' }
  }
}

/**
 * 创建空的 TipTap JSON 文档
 * @returns 空文档对象
 */
export function createEmptyDocument(): TipTapJSON {
  return {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  }
}

/**
 * 安全地解析 TipTap JSON
 * @param content - JSON 字符串
 * @returns 解析后的对象或空文档
 */
export function safeParseJSON(content: string): TipTapJSON {
  if (!content) return createEmptyDocument()

  try {
    const parsed = JSON.parse(content) as TipTapJSON
    if (parsed.type === 'doc') {
      return parsed
    }
    return createEmptyDocument()
  } catch {
    return createEmptyDocument()
  }
}
