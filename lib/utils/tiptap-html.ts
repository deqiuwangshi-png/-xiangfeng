/**
 * TipTap JSON 转 HTML 工具
 *
 * 在服务端将 TipTap JSON 内容转换为 HTML
 *
 * @module tiptap-html
 */

import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import type { TipTapJSON } from './json'

// 用于服务端渲染的扩展配置
// 必须与客户端 useTipTapEditor.ts 中的扩展保持一致
const extensions = [
  StarterKit,
  Image,
  TextStyle,
  Color,
]

/**
 * 将 TipTap JSON 转换为 HTML
 *
 * @param json - TipTap JSON 对象或字符串
 * @returns HTML 字符串
 *
 * @example
 * ```typescript
 * const html = generateHTMLFromJSON(json)
 * // 返回: '<p>Hello <strong>World</strong></p>'
 * ```
 */
export function generateHTMLFromJSON(json: TipTapJSON | string): string {
  if (!json) return ''

  try {
    const jsonContent = typeof json === 'string' ? JSON.parse(json) : json
    return generateHTML(jsonContent, extensions)
  } catch (error) {
    console.error('Failed to generate HTML from JSON:', error)
    return ''
  }
}

/**
 * 将 TipTap JSON 转换为纯文本
 * 用于生成摘要或预览
 *
 * @param json - TipTap JSON 对象或字符串
 * @returns 纯文本
 */
export function generateTextFromJSON(json: TipTapJSON | string): string {
  if (!json) return ''

  try {
    const html = generateHTMLFromJSON(json)
    // 移除 HTML 标签，保留纯文本
    return html.replace(/<[^>]*>/g, '').trim()
  } catch {
    return ''
  }
}
