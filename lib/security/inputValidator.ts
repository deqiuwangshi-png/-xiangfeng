/**
 * 输入验证与净化工具
 *
 * @module lib/security/inputValidator
 * @description 提供用户输入的验证、净化和 XSS 防护
 *
 * @安全特性
 * - 基于 Zod 的 Schema 验证
 * - HTML 标签和脚本过滤
 * - 危险字符转义
 * - 输入长度和格式限制
 */

import { z } from 'zod'

/**
 * 危险 HTML 标签和事件处理器正则
 * 用于检测潜在的 XSS 攻击向量
 */
const DANGEROUS_PATTERNS = {
  // 脚本标签
  SCRIPT_TAG: /<script[^>]*>.*?<\/script>/gi,
  // 事件处理器属性
  EVENT_HANDLERS: /on\w+\s*=\s*["']?[^"'>]*["']?/gi,
  // javascript: 伪协议
  JS_PROTOCOL: /javascript:/gi,
  // data: 伪协议（可能包含恶意代码）
  DATA_PROTOCOL: /data:(?!image\/(png|jpg|jpeg|gif|webp|svg))/gi,
  // iframe、object 等嵌入标签
  EMBED_TAGS: /<(iframe|object|embed|applet|form|input|textarea|button)[^>]*>/gi,
  // 危险的 HTML 标签
  DANGEROUS_TAGS: /<\/?(script|style|link|meta|base|head|html|body)[^>]*>/gi,
}

/**
 * 检测字符串是否包含潜在的 XSS 攻击代码
 *
 * @param input - 待检测的输入字符串
 * @returns 是否包含危险内容
 *
 * @example
 * ```typescript
 * const isDangerous = containsXss('<script>alert(1)</script>')
 * // 返回: true
 * ```
 */
export function containsXss(input: string): boolean {
  if (!input || typeof input !== 'string') return false

  return Object.values(DANGEROUS_PATTERNS).some(pattern => pattern.test(input))
}

/**
 * 净化用户输入文本
 * - 移除所有 HTML 标签（纯文本模式）
 * - 转义特殊字符
 * - 标准化空白字符
 *
 * @param input - 原始输入
 * @returns 净化后的安全文本
 *
 * @example
 * ```typescript
 * const safe = sanitizeText('<p>Hello</p>')
 * // 返回: 'Hello'
 * ```
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return (
    input
      // 移除所有 HTML 标签
      .replace(/<[^>]*>/g, '')
      // 转义 HTML 实体
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // 标准化空白字符（防止零宽字符攻击）
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // 规范化换行和空格
      .trim()
  )
}

/**
 * 宽松净化 - 允许特定格式的文本
 * 用于个人简介等可能需要保留换行的字段
 *
 * @param input - 原始输入
 * @returns 净化后的文本（保留换行）
 */
export function sanitizeMultilineText(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return (
    input
      // 移除所有 HTML 标签
      .replace(/<[^>]*>/g, '')
      // 转义 HTML 实体
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // 移除零宽字符
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // 保留换行，但规范化
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim()
  )
}

/**
 * 验证用户名
 * - 长度 2-20 字符
 * - 只允许中文、字母、数字、下划线、连字符
 * - 不能以特殊字符开头或结尾
 *
 * @param username - 用户名
 * @returns 验证结果
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false

  // 用户名规则：2-20 字符，中文/字母/数字/下划线/连字符，不能以下划线或连字符开头结尾
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9_-]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]$/
  return usernameRegex.test(username) && username.length >= 2 && username.length <= 20
}

/**
 * 验证城市名称
 * - 长度 0-20 字符
 * - 只允许中文、字母、空格、连字符
 *
 * @param location - 城市名称
 * @returns 验证结果
 */
export function isValidLocation(location: string): boolean {
  if (!location) return true // 允许为空
  if (typeof location !== 'string') return false

  // 城市名称：1-20 字符，允许中文、字母、空格、连字符
  const locationRegex = /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z\s-]{0,18}[\u4e00-\u9fa5a-zA-Z\s]$/
  return location.length <= 20 && locationRegex.test(location)
}

/**
 * 验证个人领域
 * - 长度 0-30 字符
 * - 只允许中文、字母、数字、空格、连字符、逗号
 *
 * @param domain - 个人领域
 * @returns 验证结果
 */
export function isValidDomain(domain: string): boolean {
  if (!domain) return true // 允许为空
  if (typeof domain !== 'string') return false

  // 个人领域：1-30 字符，允许中文、字母、数字、空格、连字符、逗号
  const domainRegex = /^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9\s,，-]{0,28}[\u4e00-\u9fa5a-zA-Z0-9]$/
  return domain.length <= 30 && domainRegex.test(domain)
}

/**
 * 验证个人简介
 * - 长度 0-200 字符
 * - 不能包含危险代码
 *
 * @param bio - 个人简介
 * @returns 验证结果
 */
export function isValidBio(bio: string): boolean {
  if (!bio) return true // 允许为空
  if (typeof bio !== 'string') return false

  return bio.length <= 200 && !containsXss(bio)
}

/**
 * 个人资料更新参数 Schema
 * 用于 Server Action 的输入验证
 */
export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(2, '用户名至少需要 2 个字符')
    .max(20, '用户名最多 20 个字符')
    .regex(
      /^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9_-]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]$/,
      '用户名只能包含中文、字母、数字、下划线和连字符，且不能以下划线或连字符开头或结尾'
    )
    .transform(val => sanitizeText(val)),

  bio: z
    .string()
    .max(200, '个人简介最多 200 个字符')
    .optional()
    .nullable()
    .transform(val => (val ? sanitizeMultilineText(val) : '')),

  location: z
    .string()
    .max(20, '所在城市最多 20 个字符')
    .optional()
    .nullable()
    .refine(val => !val || isValidLocation(val), {
      message: '城市名称包含不支持的字符',
    })
    .transform(val => (val ? sanitizeText(val) : '')),

  domain: z
    .string()
    .max(30, '个人领域最多 30 个字符')
    .optional()
    .nullable()
    .refine(val => !val || isValidDomain(val), {
      message: '个人领域包含不支持的字符',
    })
    .transform(val => (val ? sanitizeText(val) : '')),

  avatar_url: z
    .union([
      z.string().pipe(z.url({ message: '头像 URL 格式不正确' })),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .refine(
      val => val === '' || val === null || val === undefined || val.startsWith('https://'),
      '头像 URL 必须使用 HTTPS 协议'
    )
    .refine(val => val === '' || val === null || val === undefined || !containsXss(val), {
      message: '头像 URL 包含危险内容',
    })
    .transform(val => val === '' ? null : val),
})

/**
 * 验证并净化个人资料更新参数
 *
 * @param params - 原始参数
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * const result = validateProfileInput({
 *   username: '<script>alert(1)</script>',
 *   bio: 'Hello World'
 * })
 * if (!result.success) {
 *   console.error(result.errors)
 * }
 * ```
 */
export function validateProfileInput(params: unknown): {
  success: boolean
  data?: {
    username: string
    bio: string
    location: string
    domain: string
    avatar_url?: string | null
  }
  errors?: string[]
} {
  const result = UpdateProfileSchema.safeParse(params)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue: { message: string }) => issue.message),
    }
  }

  return {
    success: true,
    data: result.data,
  }
}
